import { asyncHandler } from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiRespose";
import ApiError from "../utils/ApiError";
import { Request, Response } from "express";
import prisma from "../config/prisma";
import userSchema from "../schemas/user.schema";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt";
import { RequestWithUser } from "../utils/interface";
import { z } from "zod";

export const signup = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role, address } = req.body;

    const isValidData = userSchema.safeParse({
        name,
        email,
        password,
        role,
        address
    });

    if (!isValidData.success) {
        const errorMessage: string = isValidData.error.errors
            .map((error: any) => `${error.path.join(".")} ${error.message}`)
            .join(". ");

        console.log(errorMessage);
        throw new ApiError(400, {
            message: errorMessage
        });
    }

    const invalidRole = ["ADMIN", "STORE_OWNER"].includes(role);

    if (invalidRole) {
        throw new ApiError(400, {
            message: "Invalid role you can only be a user"
        });
    }
    
    const doesUserExist = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (doesUserExist) {
        throw new ApiError(400, {
            message: "User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            address,
            role
        }
    })

    if (!newUser) {
        throw new ApiError(500, {
            message: "User could not be created"
        });
    }

    return res.status(201).json(new ApiResponse({
        statusCode: 201,
        data: {
            user: newUser,
        },
        message: "User created successfully"
    }));
})

export const login = asyncHandler(async (req: Request, res: Response) => {

    const { email, password } = req.body;

    if(!email.trim() || !password.trim()) {
        throw new ApiError(400, {
            message: "Email and password are required"
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        throw new ApiError(401, {
            message: "Invalid credentials"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(401, {
            message: "Invalid credentials"
        });
    }

    const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role
    });

    const cookiesOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    };

    res.cookie("token", token, cookiesOptions);

    return res.status(200).json(new ApiResponse({
        statusCode: 200,
        message: "Login successful",
        data: {
            accessToken: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address
            }
        }
    }))
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    const cookiesOptions = {
        httpOnly: true,
        expires: new Date(Date.now()),
    };

    res.cookie("accessToken", "", cookiesOptions);

    return res.status(200).json(new ApiResponse({
        statusCode: 200,
        message: "Logout successful",
        data: null
    }))
});


export const changePassword = asyncHandler(async (req: RequestWithUser, res: Response) => {

    const { oldPassword, newPassword } = req.body;


    const isValidData = userSchema.safeParse({
        password: newPassword
    });
    
    if (!isValidData.success) {
         console.log("Password validation failed:", isValidData.error.errors);
        const error = isValidData.error.errors[0];
        throw new ApiError(400, {
            message: error.message
        });
    }

    if (!req.user) {
        throw new ApiError(401, {
            message: "Not authenticated"
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id
        }
    });

    if (!user) {
        throw new ApiError(401, {
            message: "Invalid credentials"
        });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
        throw new ApiError(401, {
            message: "Invalid credentials"
        });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: {
            id: req.user.id
        },
        data: {
            password: hashedPassword
        }
    });

    return res.status(200).json(new ApiResponse({
        statusCode: 200,
        message: "Password changed successfully",
        data: null
    }))
})