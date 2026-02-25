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
        const { label, imageUrl } = body;

        if(!label) {
            return new NextResponse("Label is required", {status: 400});
        }
        if(!imageUrl) {
            return new NextResponse("Image URL is required", {status: 400});
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
    
        const newBillboard = await db.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        });

        return NextResponse.json(newBillboard);
    } catch (error) {
        console.log('[BILLBOARD_POST]',error);
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
    
        const billboards = await db.billboard.findMany({
            where: {
                storeId: params.storeId,
            }
        });

        return NextResponse.json(billboards);
    } catch (error) {
        console.log('[BILLBOARDS_GET]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}