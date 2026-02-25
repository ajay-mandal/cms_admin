"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settings } from "@/actions/settings";

import { SettingsSchema } from "@/zod/validator";
import {useState, useTransition } from "react";

import {
    Form,
    FormField,
    FormControl,
    FormItem,
    FormDescription,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {

    const user = useCurrentUser();
    const [error, setError ] = useState<string | undefined>();
    const [success, setSuccess ] = useState<string | undefined>();
    const [isPending, startTransition ] = useTransition();

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || undefined,
            email: user?.email || undefined,
            password: undefined,
            newPassword: undefined,
            role: user?.role || undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
        }
    });
    const onSubmit = (values: z.infer<typeof SettingsSchema> ) => {
        startTransition(() => {
            settings(values)
            .then((data)=>{
                if(data.error) {
                    setError(data.error);
                }
                if(data.success) {
                    setSuccess(data.success);
                }
            })
            .catch(()=>{
                setError("Something went wrong!");
            })
        })
    }
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                title="Profile"
                description="Manage your profile settings"
                />
            </div>
            <Separator />
            <Form {...form}>
                <form
                className="space-y-8 w-full"
                onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="grid grid-rows-1 gap-8">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) =>  (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                    {...field}
                                    placeholder="Your Name"
                                    disabled={isPending}
                                    className="w-1/3"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        {user?.isOAuth === false && (
                            <>
                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) =>  (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                        {...field}
                                        placeholder="Your Email"
                                        disabled={isPending}
                                        className="w-1/3"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) =>  (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                        {...field}
                                        placeholder="*****"
                                        type="password"
                                        disabled={isPending}
                                        className="w-1/3"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) =>  (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                        {...field}
                                        placeholder="*****"
                                        type="password"
                                        disabled={isPending}
                                        className="w-1/3"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            </>
                        )}
                        {user?.isOAuth === false && (
                            <FormField
                            control={form.control}
                            name="isTwoFactorEnabled"
                            render={({ field }) =>  (
                                <FormItem className="flex flex-row items-center
                                justify-between rounded-lg border p-3 shadow-sm w-1/3">
                                    <div className="space-y-0.5">
                                        <FormLabel>Two Factor Authentication</FormLabel>
                                        <FormDescription>
                                            Enable two factor authentication for your account
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                        disabled={isPending}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                                )}
                            />
                        )}
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <div className="flex justify-end w-1/3">
                        <Button
                        type="submit"
                        disabled={isPending}
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default ProfilePage;
