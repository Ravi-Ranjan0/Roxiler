import * as z from 'zod';
import userSchema , { userPassword } from "./user.schema";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: userPassword,
})


export const signupSchema = userSchema;