"use server";

import { db } from "@/lib/db";
import { currentUserServerSide } from "@/hooks/currentUserServerSide";

export const storeDelete = async (params: string) => {

    const user = await currentUserServerSide();

    await db.store.deleteMany({
        where: {
            id: params,
            userId: user?.id
        }
    });
}
