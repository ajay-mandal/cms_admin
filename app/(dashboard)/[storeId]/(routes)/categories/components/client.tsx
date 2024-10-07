"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { ApiList } from "@/components/ui/api-list";

interface CategoryClientProps {
    data: CategoryColumn[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
    data
}) => {
    const route = useRouter();
    const params = useParams();

    return ( 
        <>
            <div className="flex justify-between items-center">
                <Heading 
                title={`Categories (${data.length})`}
                description="Manage categories for your store"
                />
                <Button onClick={()=> route.push(`/${params.storeId}/categories/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="label"/>
            <Heading title="API" description="API calls for Categories"/>
            <Separator />
            <ApiList entityIdName="categoryId" entityName="categories"/>
        </>
    );
}
 