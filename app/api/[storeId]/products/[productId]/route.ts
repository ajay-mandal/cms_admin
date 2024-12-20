import { currentUserServerSide } from "@/hooks/currentUserServerSide";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: {params: {productId: string}}
) {
    try{
        if(!params.productId) {
            return new NextResponse("Product id is required", {status: 400});
        }
    
        const product = await db.product.findUnique({
            where: {
                id: params.productId
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_GET]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function PATCH (
    req: Request,
    { params }: {params: { storeId: string, productId: string}}
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
        if(!sizeId) {
            return new NextResponse("sizeId is required", {status: 400});
        }
        if(!quantity) {
            return new NextResponse("Update the quantity", {status: 400});
        }
        if(!description) {
            return new NextResponse("Description the quantity", {status: 400});
        }
        if(!params.productId) {
            return new NextResponse("product ID is required", {status: 400});
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
    
        await db.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name, 
                price, 
                categoryId, 
                colorId, 
                sizeId,
                description,
                quantity,
                images: {
                    deleteMany: {}
                },
                isFeatured, 
                isArchived
            }
        });

        const updateProduct = await db.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string}) => image)
                        ]
                    }
                },
            }
        })

        return NextResponse.json(updateProduct);
    } catch (error) {
        console.log('[PRODUCT_PATCH]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function DELETE (
    req: Request,
    { params }: {params: { storeId: string, productId: string}}
) {
    try{
        const user = await currentUserServerSide();
        if (!user) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!params.productId) {
            return new NextResponse("Product ID is required", {status: 400});
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
    
        const deletedProduct = await db.product.deleteMany({
            where: {
                id: params.productId
            }
        });

        return NextResponse.json(deletedProduct);
    } catch (error) {
        console.log('[PRODUCT_DELETE]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}