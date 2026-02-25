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
    params: Promise<{ storeId: string }>
}) {
    const { storeId } = await params;
    const userId = await currentIdServerSide();

    const store = await db.store.findFirst({
        where: {
            id: storeId,
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
