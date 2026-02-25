import { redirect } from "next/navigation";

import { currentIdServerSide } from "@/hooks/currentUserServerSide";
import Navbar from "@/components/navbar";
import React from "react";


export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const userId = await currentIdServerSide();

    return (
        <>
            <Navbar />
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    {children}
                </div>
            </div>
        </>
    );
}