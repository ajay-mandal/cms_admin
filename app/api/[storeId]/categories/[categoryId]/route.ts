import { currentUserServerSide } from "@/hooks/currentUserServerSide";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: {params: {categoryId: string}}
) {
    try{
        if(!params.categoryId) {
            return new NextResponse("Category ID is required", {status: 400});
        }
    
        const category = await db.category.findUnique({
            where: {
                id: params.categoryId
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORY_GET]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function PATCH (
    req: Request,
    { params }: {params: { storeId: string, categoryId: string}}
) {
    try{
        const user = await currentUserServerSide();
        if (!user) {
            return new NextResponse("Unauthenticated", {status: 401});
        }
    
        const body = await req.json();
        const { name, billboardId } = body;

        if(!name) {
            return new NextResponse("Name is required", {status: 400});
        }
        if(!billboardId) {
            return new NextResponse("Billboard_ID is required", {status: 400});
        }
        if(!params.categoryId) {
            return new NextResponse("category_ID is required", {status: 400});
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
    
        const updateCategory = await db.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId
            }
        });

        return NextResponse.json(updateCategory);
    } catch (error) {
        console.log('[CATEGORY_PATCH]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function DELETE (
    req: Request,
    { params }: {params: { storeId: string, categoryId: string}}
) {
    try{
        const user = await currentUserServerSide();
        if (!user) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!params.categoryId) {
            return new NextResponse("Category_ID is required", {status: 400});
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
    
        const deletedCategory = await db.category.deleteMany({
            where: {
                id: params.categoryId
            }
        });

        return NextResponse.json(deletedCategory);
    } catch (error) {
        console.log('[CATEGORY_DELETE]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}