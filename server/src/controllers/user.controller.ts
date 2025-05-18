import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiRespose";
import ApiError from "../utils/ApiError";
import userSchema from "../schemas/user.schema";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt";


export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { name, email, password, address } = req.body;

        const isValidData = userSchema.safeParse({
            name,
            email,
            password,
            address
        });

        if (!isValidData.success) {
            const error = isValidData.error.errors[0];
            throw new ApiError(400, {
                message: error.message
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
                role: "USER"
            }
        });

        if (!newUser) {
            throw new ApiError(500, {
                message: "User could not be created"
            });
        }

        const token = signToken({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role
        });

        const cookiesOptions = {
            httpOnly: true,
        }

        return res.status(201)
            .cookie("accessToken", token, cookiesOptions)
            .json(new ApiResponse({
                statusCode: 201,
                message: "User created successfully",
                data: {
                    accessToken: token
                }
            }))

    } catch (error) {
        return res.status(500).json(new ApiError(500, {
            message: "Internal server error",
        }));
    }
});

