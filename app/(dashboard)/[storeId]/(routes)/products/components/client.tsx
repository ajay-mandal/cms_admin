"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { ApiList } from "@/components/ui/api-list";

interface ProductClientProps {
    data: ProductColumn[]
}

export const ProductClient: React.FC<ProductClientProps> = ({
    data
}) => {
    const route = useRouter();
    const params = useParams();

    return ( 
        <>
            <div className="flex justify-between items-center">
                <Heading 
                title={`Products (${data.length})`}
                description="Manage products for your store"
                />
                <Button onClick={()=> route.push(`/${params.storeId}/products/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name"/>
            <Heading title="API" description="API calls for Products"/>
            <Separator />
            <ApiList entityIdName="productId" entityName="products"/>
        </>
    );
}
 