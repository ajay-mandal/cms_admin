import { redirect } from "next/navigation";

import { currentIdServerSide } from "@/hooks/currentUserServerSide";
import { db } from "@/lib/db";
import Navbar from "@/components/navbar";
import React from "react";


export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { storeId: string }
}) {
    const userId = await currentIdServerSide();

    const store = await db.store.findFirst({
        where: {
            id: params.storeId,
            userId
        },
    });

    if (!store) {
        redirect('/');
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
