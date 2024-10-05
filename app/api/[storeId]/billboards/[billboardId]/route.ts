import { currentUserServerSide } from "@/hooks/currentUserServerSide";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: {params: {billboardId: string}}
) {
    try{
        if(!params.billboardId) {
            return new NextResponse("Billboard ID is required", {status: 400});
        }
    
        const billboard = await db.billboard.findUnique({
            where: {
                id: params.billboardId
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARD_GET]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function PATCH (
    req: Request,
    { params }: {params: { storeId: string, billboardId: string}}
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
        if(!params.billboardId) {
            return new NextResponse("Billboard ID is required", {status: 400});
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
    
        const updateBillboard = await db.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        });

        return NextResponse.json(updateBillboard);
    } catch (error) {
        console.log('[BILLBOARD_PATCH]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function DELETE (
    req: Request,
    { params }: {params: { storeId: string, billboardId: string}}
) {
    try{
        const user = await currentUserServerSide();
        if (!user) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!params.billboardId) {
            return new NextResponse("Billboard ID is required", {status: 400});
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
    
        const deletedBillboard = await db.billboard.deleteMany({
            where: {
                id: params.storeId
            }
        });

        return NextResponse.json(deletedBillboard);
    } catch (error) {
        console.log('[BILLBOARD_DELETE]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}