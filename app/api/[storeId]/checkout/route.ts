
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

import { db } from "@/lib/db";
import Stripe from "stripe";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};


export async function OPTIONS () {
    return NextResponse.json({}, { headers: corsHeaders });
}


export async function POST(
    req:Request,
    { params } : { params: { storeId: string } }
) {
    try{
        const { productsIds } = await req.json();

        if(!productsIds || productsIds.length === 0) {
            return new NextResponse("Products ids are required", { status: 400});
        }

        const products = await db.product.findMany({
            where: {
                id: {
                    in: productsIds
                }
            }
        });

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

        products.forEach((product) => {
            line_items.push({
                quantity: 1,
                price_data: {
                    currency: "INR",
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: product.price.toNumber() * 100
                }
            });
        });

        const order = await db.order.create({
            data: {
                storeId: params.storeId,
                isPaid: false,
                orderItems: {
                    create: productsIds.map((productId: string) => ({
                        product: {
                            connect: {
                                id: productId
                            }
                        }
                    }))
                }
            }
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            billing_address_collection: "required",
            phone_number_collection: {
                enabled: true
            },
            success_url: `${process.env.NEXT_PUBLIC_FRONTEND_STORE_URL}/cart?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_STORE_URL}/cart?canceled=1`,
            metadata: {
                orderId: order.id
            }
        });
        console.log(session);

        return NextResponse.json({ url: session.url }, {
            headers: corsHeaders
        });
    }catch (error) {
        console.error('[CHECKOUT_ERROR]', error);
        return new NextResponse("Internal error", { status: 500 });
    }   
};