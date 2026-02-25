"use client";

import React from "react";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { OrdersColumn, columns } from "./columns";

interface OrdersClientProps {
    data: OrdersColumn[]
}

export const OrdersClient: React.FC<OrdersClientProps> = ({
    data
}) => {
    return ( 
        <>
            <Heading 
            title={`Orders (${data.length})`}
            description="Manage orders for your store"
            />
            <Separator />
            <DataTable columns={columns} data={data} searchKey="products"/>
        </>
    );
}
 