import { currentUserServerSide } from "@/hooks/currentUserServerSide";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: {params: {colorId: string}}
) {
    try{
        if(!params.colorId) {
            return new NextResponse("Color_ID is required", {status: 400});
        }
    
        const color = await db.color.findUnique({
            where: {
                id: params.colorId
            }
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log('[COLOR_GET]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function PATCH (
    req: Request,
    { params }: {params: { storeId: string, colorId: string}}
) {
    try{
        const user = await currentUserServerSide();
        if (!user) {
            return new NextResponse("Unauthenticated", {status: 401});
        }
    
        const body = await req.json();
        const { name, value } = body;

        if(!name) {
            return new NextResponse("Name is required", {status: 400});
        }
        if(!value) {
            return new NextResponse("Value is required", {status: 400});
        }
        if(!params.colorId) {
            return new NextResponse("color_ID is required", {status: 400});
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
    
        const updateColor = await db.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(updateColor);
    } catch (error) {
        console.log('[COLOR_PATCH]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function DELETE (
    req: Request,
    { params }: {params: { storeId: string, colorId: string}}
) {
    try{
        const user = await currentUserServerSide();
        if (!user) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!params.colorId) {
            return new NextResponse("COLOR_ID is required", {status: 400});
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
    
        const deletedColor = await db.color.deleteMany({
            where: {
                id: params.colorId
            }
        });

        return NextResponse.json(deletedColor);
    } catch (error) {
        console.log('[COLOR_DELETE]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}