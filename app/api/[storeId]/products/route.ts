import { currentUserServerSide } from "@/hooks/currentUserServerSide";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST (
    req: Request,
    { params} : { params : { storeId: string}}
) {
    try{
        const user = await currentUserServerSide();
        if (!user) {
            return new NextResponse("Unauthenticated", {status: 401});
        }
    
        const body = await req.json();
        const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived, quantity, description } = body;

        if(!name) {
            return new NextResponse("Name is required", {status: 400});
        }

        if(!images || !images.length) {
            return new NextResponse("Images are required", {status: 400});
        }
        if(!price) {
            return new NextResponse("Price is required", {status: 400});
        }
        if(!categoryId) {
            return new NextResponse("categoryId is required", {status: 400});
        }
        if(!colorId) {
            return new NextResponse("colorId is required", {status: 400});
        }
        if(!quantity) {
            return new NextResponse("Available quantity is required", {status: 400});
        }
        if (!sizeId ) {
            return new NextResponse("SizeId is required", { status: 400 });
        }
        if (!description ) {
            return new NextResponse("Description is required", { status: 400 });
        }

        if(!params.storeId) {
            return new NextResponse("StoreID is required", {status: 400});
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId: user.id
            }
        })

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }
    
        const products = await db.product.create({
            data: {
                name, 
                price, 
                categoryId, 
                colorId, 
                sizeId,
                description,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string}) => image)
                        ]
                    }
                },
                quantity,
                isFeatured, 
                isArchived,
                storeId: params.storeId
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.log('[PRODUCTS_POST]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function GET (
    req: Request,
    { params} : { params : { storeId: string}}
) {
    try{

        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        if(!params.storeId) {
            return new NextResponse("StoreID is required", {status: 400});
        }
    
        const products = await db.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            }, 
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.log('[PRODUCTS_GET]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}