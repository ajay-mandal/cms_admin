"use client";

import * as z from "zod";
import { Store } from "@prisma/client";
import { Trash, X } from "lucide-react";
import React,{ useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrigin } from "@/hooks/use-origin";
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
import { ApiAlert } from "@/components/ui/api-alert";


interface SettingFormProps {
    initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(1,{
        message: "Name is required"
    }),
});

type SettingFormValues = z.infer<typeof formSchema>;

export const SettingForm: React.FC<SettingFormProps> = ({
    initialData
}) => {

    const params = useParams();
    const route = useRouter();
    const origin = useOrigin();

    const [open, setOpen ] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const onSubmit = async(values: SettingFormValues) => {
        try{
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, values)
            route.refresh();
            toast.success("Store updated.")
        }catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async() => {
        try{
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`)
            route.refresh();
            route.push("/");
            toast.success("Store deleted.")
        }catch (error) {
            toast.error("Make sure you removed all products and categories first.");
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
                title="Settings"
                description="Manage store preferences"
                />
                <Button
                disabled={loading}
                variant="destructive"
                size="icon"
                onClick={()=> setOpen(true)}
                >
                    <Trash className="h-4 w-4" />
                </Button>
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
                                    <Input disabled={loading} placeholder="Store name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        Save changes
                    </Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert 
            title="NEXT_PUBLIC_API_URL" 
            description={`${origin}/api/${params.storeId}`}
            variant="public"
            />
        </>
    )
}