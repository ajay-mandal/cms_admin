import { currentUserServerSide } from "@/hooks/currentUserServerSide";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST (
    req: Request,
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
    
        const newStore = await db.store.create({
            data: {
                name,
                userId: user.id || ""
            }
        });

        return NextResponse.json(newStore);
    } catch (error) {
        console.log('[STORE_POST]',error);
        return new NextResponse("Internal error", {status: 500});
    }
}
