"use server";

import * as z from "zod";

import { storeSchema } from "@/zod/validator";
import { db } from "@/lib/db";
import { currentUserServerSide } from "@/hooks/currentUserServerSide";

export const store = async (values: z.infer<typeof storeSchema>) => {

    const validatedFields = storeSchema.safeParse(values);

    if(!validatedFields.success) {
        return {error: "Invalid fields!"}
    }

    const { name } = validatedFields.data;
    const user = await currentUserServerSide();

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
