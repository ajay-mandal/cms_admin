"use client";

import * as z from "zod";
import { Color } from "@prisma/client";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-model";

const formSchema = z.object({
    name: z.string().min(1, {
        message:"Name is required"
    }),
    value: z.string().min(4, {
        message:"Value must be > 2"
    }).regex(/^#/, {
        message: "Must be a valid hex code"
    })
});

type ColorValues = z.infer<typeof formSchema>;

interface ColorProps {
    initialData: Color | null;
}


export const ColorForm: React.FC<ColorProps> = ({
    initialData
}) => {

    const params = useParams();
    const route = useRouter();

    const [open, setOpen ] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit color" : "Create color";
    const description = initialData ? "Edit a color" : "Add a new color";
    const toastMessage = initialData ? "Color updated." : "Color created.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<ColorValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
        name : '',
        value: ''
        }
    });

    const onSubmit = async(values: ColorValues) => {
        try{
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, values);
            } else {
                await axios.post(`/api/${params.storeId}/colors`, values);
            }
            route.push(`/${params.storeId}/colors`)
            route.refresh();
            toast.success(toastMessage)
        }catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async() => {
        try{
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
            route.push(`/${params.storeId}/colors`);
            route.refresh();
            toast.success("Color deleted.")
        }catch (error) {
            toast.error("Make sure you removed all products using this color first.");
        } finally {
            setLoading(false);
            setOpen(false);
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
            <div className="flex items-center justify-between">
                <Heading
                title={title}
                description={description}
                />
                {initialData && (                
                    <Button
                    disabled={loading}
                    variant="destructive"
                    size="icon"
                    onClick={()=> setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Color name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-x-4">
                                        <Input disabled={loading} placeholder="Color value" {...field} />
                                        <div 
                                            className="border p-4 rounded-full"
                                            style={{ backgroundColor: field.value}}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}