import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(", ");

  if (event.type === "checkout.session.completed") {
    const order = await db.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
      },
      include: {
        orderItems: true,
      },
    });

    const productsIds = order.orderItems.map(
      (orderItem) => orderItem.productId,
    );

    await Promise.all(
      productsIds.map(async (productId) => {
        const product = await db.product.findUnique({
          where: { id: productId },
          select: { quantity: true },
        });

        if (product) {
          const newQuantity = product.quantity - 1;
          await db.product.update({
            where: { id: productId },
            data: {
              quantity: newQuantity,
              isArchived: newQuantity === 0,
            },
          });
        }
      }),
    );
  }
  return new NextResponse(null, { status: 200 });
}
