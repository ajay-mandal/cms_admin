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
        const { name, billboardId } = body;

        if(!name) {
            return new NextResponse("Name is required", {status: 400});
        }
        if(!billboardId) {
            return new NextResponse("BillboardID is required", {status: 400});
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
    
        const newCategory = await db.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        });

        return NextResponse.json(newCategory);
    } catch (error) {
        console.log('[CATEGORIES_POST]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function GET (
    req: Request,
    { params} : { params : { storeId: string}}
) {
    try{

        if(!params.storeId) {
            return new NextResponse("StoreID is required", {status: 400});
        }
    
        const categories = await db.category.findMany({
            where: {
                storeId: params.storeId,
            }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.log('[CATEGORIES_GET]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}