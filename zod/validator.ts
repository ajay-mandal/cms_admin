import { UserRole } from '@prisma/client';
import * as z from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    }),
    code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Enter a valid email"
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required"
    }),
    name: z.string().min(1, {
        message: "Name is required"
    }),
    confirm_password:z.string().min(6,{
        message:"Minimum characters should be 6"
    }),
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum 6 character required"
    })
});

export const SettingsSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6, {
        message: "Minimum 6 character required"
    })),
    newPassword: z.optional(z.string().min(6, {
        message: "Minimum 6 character required"
    })),
})
.refine((data)=> {
    if(data.password && !data.newPassword) {
        return false;
    }
    return true;
}, {
    message : "New password is required!",
    path: ["newPassword"]
})
.refine((data)=> {
    if(data.newPassword && !data.password) {
        return false;
    }
    return true;
}, {
    message : "Password is required!",
    path: ["password"]
})


// Modal Schemas

export const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is Required"
    }),
    
})

export const storeSchema = z.object({
    name: z.string().min(1, {
        message: "Name is Required"
    })
})

export const billboardSchema = z.object({
    label: z.string().min(1, {
        message: "Label is Required"
    }),
    imageUrl: z.string().min(1,{
        message: "ImageUrl is required"
    })
})