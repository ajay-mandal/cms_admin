import { redirect } from "next/navigation";

import { currentIdServerSide } from "@/hooks/currentUserServerSide";
import { db } from "@/lib/db";
import React from "react";

export default async function SetupLayout({
    children
}:{
    children: React.ReactNode
}) {

    const userId = await currentIdServerSide();

    const store = await db.store.findFirst({
        where: {
            userId
        }
    });

    if(store) {
        redirect(`/${store.id}`);
    }

    return (
        <>
        {children}
        </>
    )
}