"use server";

import * as z from "zod";

import { billboardSchema } from "@/zod/validator";
import { db } from "@/lib/db";
import { currentUserServerSide } from "@/hooks/currentUserServerSide";

export const billboardCreate = async (storeId: string, values: z.infer<typeof billboardSchema>) => {
    try {
        const user = await currentUserServerSide();
        if (!user) {
            return { error: "Unauthenticated"};
        }

        const validatedFields = billboardSchema.safeParse(values);
        if(!validatedFields.success) {
            return {error: "Invalid fields!"}
        }

        const { label, imageUrl } = validatedFields.data;

        if(!storeId) {
            return {error: "StoreID is required"}
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: storeId,
                userId: user?.id
            }
        })

        if(!storeByUserId) {
            return {error: "Unauthorized"}
        }

        const newBillboard = await db.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: storeId
            }
        });

        return {
            id: newBillboard.id
        }
    }catch (error) {
        console.log(`[BILLBOARD_CREATE]`, error);
    }
}


export const getBillboards = async(storeId: string,) => {
    try {
        const user = await currentUserServerSide();
        if (!user) {
            return { error: "Unauthenticated"};
        }
        if(!storeId) {
            return {error: "StoreID is required"}
        }
        
        const allBillboards = await db.billboard.findMany({
            where: {
                storeId
            }
        })

        return allBillboards;
    }catch (error) {
        console.log(`[BILLBOARD_GET_ALL]`, error);
    }
}


export const getBillboardById = async (billboardId: string) => {

    try {
        if(!billboardId) {
            return {error: "BillboardID is required"}
        }

        
        const billboardById = await db.billboard.findUnique({
            where: {
                id: billboardId,
            }
        })

        return billboardById;
    }catch (error) {
        console.log(`[BILLBOARD_GET_BY_ID]`, error);
    }
}



export const billboardUpdate = async (storeId: string, billboardId: string, values: z.infer<typeof billboardSchema>) => {

    try {
        const user = await currentUserServerSide();
        if (!user) {
            return { error: "Unauthenticated"};
        }

        const validatedFields = billboardSchema.safeParse(values);
        if(!validatedFields.success) {
            return {error: "Invalid fields!"}
        }
        const { label, imageUrl } = validatedFields.data;

        if(!storeId) {
            return {error: "StoreID is required"}
        }

        if(!billboardId) {
            return {error: "BillboardID is required"}
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: storeId,
                userId: user?.id
            }
        })

        if(!storeByUserId) {
            return {error: "Unauthorized"}
        }

        const updateBillboard = await db.billboard.updateMany({
            where: {
                id: billboardId
            },
            data: {
                label,
                imageUrl
            }
        });
    }catch (error) {
        console.log(`[BILLBOARD_UPDATE]`, error);
    }
    
}



export const billboardDelete = async (storeId: string, billboardId: string) => {

    try{
        const user = await currentUserServerSide();

        if (!user) {
            return { error: "Unauthenticated"};
        }

        if(!storeId) {
            return {error: "StoreID is required"}
        }

        if(!billboardId) {
            return {error: "BillboardID is required"}
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: storeId,
                userId: user?.id
            }
        })

        if(!storeByUserId) {
            return {error: "Unauthorized"}
        }

        
        await db.billboard.deleteMany({
            where: {
                id: billboardId,
            }
        })
    }catch (error) {
        console.log(`[BILLBOARD_DELETE]`, error);
    }
}