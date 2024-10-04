"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { billboardDelete } from "@/actions/billboard";

import {
    Copy, 
    Edit, 
    MoreHorizontal, 
    Trash 
} from "lucide-react";

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger, 
    DropdownMenuLabel 
} from "@/components/ui/dropdown-menu";

import { BillboardColumn } from "./columns"
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-model";


interface CellActionProps {
    data: BillboardColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const route = useRouter();
    const params = useParams();

    const [open, setOpen ] = useState(false);
    const [loading, setLoading] = useState(false);

    const onCopy = ( id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Billboard ID to the clipboard")
    }

    const onDelete = async() => {
        try{
            setLoading(true);
            await billboardDelete(`${params.storeId}`,`${data.id}`)
            route.refresh();
            toast.success("Billboard deleted.")
        }catch (error) {
            toast.error("Make sure you removed all categories using this billboard first.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
        <AlertModal 
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    Actions
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={()=> onCopy(data.id)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Id
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => route.push(`/${params.storeId}/billboards/${data.id}`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Update
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=> setOpen(true)}> 
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}