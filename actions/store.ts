"use server";

import * as z from "zod";

import { storeSchema } from "@/zod/validator";
import { db } from "@/lib/db";
import { currentUserServerSide } from "@/hooks/currentUserServerSide";

export const storeCreate = async (values: z.infer<typeof storeSchema>) => {

    const user = await currentUserServerSide();
    if (!user) {
        return { error: "Unauthenticated"};
    }

    const validatedFields = storeSchema.safeParse(values);
    if(!validatedFields.success) {
        return {error: "Invalid fields!"}
    }

    const { name } = validatedFields.data;

    const newStore = await db.store.create({
        data: {
            name,
            userId: user?.id || ""
        }
    });

    return {
        id: newStore.id
    }

}

export const storeUpdate = async (params: string, values: z.infer<typeof storeSchema>) => {

    const user = await currentUserServerSide();
    if (!user) {
        return { error: "Unauthenticated"};
    }

    const validatedFields = storeSchema.safeParse(values);
    if(!validatedFields.success) {
        return {error: "Invalid fields!"}
    }

    const { name } = validatedFields.data;

    const updateStore = await db.store.updateMany({
        where: {
            id: params,
            userId: user?.id
        },
        data: {
            name
        }
    });
}

export const storeDelete = async (params: string) => {

    const user = await currentUserServerSide();

    await db.store.deleteMany({
        where: {
            id: params,
            userId: user?.id
        }
    });
}
