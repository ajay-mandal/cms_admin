"use client";

import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

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

import { ProductColumn } from "./columns"
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-model";
import axios from "axios";


interface CellActionProps {
    data: ProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const route = useRouter();
    const params = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const onCopy = ( id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Product ID to the clipboard")
    }

    const onDelete = async() => {
        try{
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${data.id}`);
            route.refresh();
            toast.success("Product deleted.")
        }catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }
    
    const handleDropdownOpenChange = (open: boolean) => {
        setIsDropdownOpen(open);
        if (!open) {
            triggerRef.current?.focus();
        }
    }

    return (
        <>
            <AlertModal 
            isOpen={open}
            onClose={()=>setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
            />
            <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
                <DropdownMenuTrigger asChild>
                    <Button ref={triggerRef} variant="ghost" className="h-8 w-8 p-0">
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
                    <DropdownMenuItem onClick={() => {
                        setIsDropdownOpen(false);
                        route.push(`/${params.storeId}/products/${data.id}`)
                        }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> {
                        setIsDropdownOpen(false);
                        setOpen(true)
                        }}> 
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}