import { currentUserServerSide } from "@/hooks/currentUserServerSide";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH (
    req: Request,
    { params }: {params: { storeId: string}}
) {
    try{
        const user = await currentUserServerSide();
        if (!user) {
            return new NextResponse("Unauthenticated", {status: 401});
        }
    
        const body = await req.json();
        const { name } = body;

        if(!name) {
            return new NextResponse("Name is required", {status: 400});
        }
        if(!params.storeId) {
            return new NextResponse("StoreID is required", {status: 400});
        }
    
        const updateStore = await db.store.updateMany({
            where: {
                id: params.storeId,
                userId: user.id
            },
            data: {
                name
            }
        });

        return NextResponse.json(updateStore);
    } catch (error) {
        console.log('[STORE_PATCH]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function DELETE (
    req: Request,
    { params }: {params: { storeId: string}}
) {
    try{
        const user = await currentUserServerSide();
        if (!user) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!params.storeId) {
            return new NextResponse("StoreID is required", {status: 400});
        }
    
        const deletedStore = await db.store.deleteMany({
            where: {
                id: params.storeId,
                userId: user.id
            }
        });

        return NextResponse.json(deletedStore);
    } catch (error) {
        console.log('[STORE_DELETE]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}