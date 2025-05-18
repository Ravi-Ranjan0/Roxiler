import { z } from 'zod';

export const userRole = z.enum([
    "ADMIN",
    "USER",
    "STORE_OWNER"
]);

export const userName = z
        .string()
        .trim()
        .min(20, {
            message: "Name must be at least 20 characters long",
        })
        .max(60, {
            message: "Name must be at most 60 characters long",
        });

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/;

const userSchema = z.object({
    name: userName,
    email: z
        .string()
        .email(),
    password: z
        .string()
        .regex(passwordRegex, {
            message: 'Password must be 8-16 characters with at least one uppercase letter and one special character',
        }),
    address: z
        .string()
        .trim()
        .min(10, {
            message: "Address must be at least 10 characters long",
        })
        .max(400 , {
            message: "Address must be at most 400 characters long",
        }),
    role: userRole
})

export type User = z.infer<typeof userSchema>;
export default userSchema;