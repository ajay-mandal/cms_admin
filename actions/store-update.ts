"use server";

import * as z from "zod";

import { storeSchema } from "@/zod/validator";
import { db } from "@/lib/db";
import { currentUserServerSide } from "@/hooks/currentUserServerSide";

export const storeUpdate = async (params: string, values: z.infer<typeof storeSchema>) => {

    const validatedFields = storeSchema.safeParse(values);

    if(!validatedFields.success) {
        return {error: "Invalid fields!"}
    }

    const { name } = validatedFields.data;
    const user = await currentUserServerSide();

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
