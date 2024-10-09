"use client";

import * as z from "zod";
import { Image, Product } from "@prisma/client";
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
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-model";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
    name: z.string().min(1, {
        message:"Name is required"
    }),
    images: z.object({ url: z.string()}).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1, {
        message: "Category ID is required"
    }),
    colorId: z.string().min(1, {
        message:"Color ID is required"
    }),
    sizeId: z.string().min(1, {
        message:"Size ID is required"
    }),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
});

type ProductValues = z.infer<typeof formSchema>;

interface ProductProps {
    initialData: Product & {
        images: Image[]
    } | null;
}


export const ProductForm: React.FC<ProductProps> = ({
    initialData
}) => {

    const params = useParams();
    const route = useRouter();

    const [open, setOpen ] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit product" : "Create product";
    const description = initialData ? "Edit a product" : "Add a new product";
    const toastMessage = initialData ? "Product updated." : "Product created.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<ProductValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price)),
        } : {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            colorId: '',
            sizeId: '',
            isFeatured: false,
            isArchived: false,
        }
    });

    const onSubmit = async(values: ProductValues) => {
        try{
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, values);
            } else {
                await axios.post(`/api/${params.storeId}/products`, values);
            }
            route.push(`/${params.storeId}/products`)
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            route.push(`/${params.storeId}/products`);
            route.refresh();
            toast.success("Product deleted.")
        }catch (error) {
            toast.error("Make sure you removed all categories using this product first.");
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
                    <FormField 
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                    value={field.value.map((image) => image.url)}
                                    disable={loading}
                                    onChange={(url) => field.onChange([...field.value, { url }])}
                                    onRemove={(url)=> field.onChange([...field.value.filter((current)=> current.url !== url)])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Product name" {...field} />
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