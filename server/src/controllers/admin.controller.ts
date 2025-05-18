import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiRespose";
import ApiError from "../utils/ApiError";
import userSchema from "../schemas/user.schema";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import storeSchema from "../schemas/store.schema";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role, address } = req.body;

    console.log(req.body);
    
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

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({});

    return res.status(200).json(new ApiResponse({
        statusCode: 200,
        message: "Users fetched successfully",
        data: {
            users
        }
    }))
});

export const createStore = asyncHandler(async (req: Request, res: Response) => {
    const { name, address, userId } = req.body;

    const isValidData = storeSchema.safeParse({
        name,
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

    const doesStoreExist = await prisma.store.findUnique({
        where: {
            name: isValidData.data.name
        }
    });

    if (doesStoreExist) {
        throw new ApiError(400, {
            message: "Store already exists"
        });
    }

    const isValidUserId = parseInt(userId);

    const doesUserExist = await prisma.user.findUnique({
        where: {
            id: isValidUserId
        }
    });

    if (!doesUserExist) {
        throw new ApiError(400, {
            message: "User does not exist"
        });
    }

    console.log(doesUserExist);

    if (doesUserExist.role !== "STORE_OWNER") {
        throw new ApiError(400, {
            message: "User is not a store owner"
        });
    }

    const newStore = await prisma.store.create({
        data: {
            name,
            address,
            ownerId: isValidUserId
        }
    });

    if (!newStore) {
        throw new ApiError(500, {
            message: "Store could not be created"
        });
    }

    return res.status(201).json(new ApiResponse({
        statusCode: 201,
        data: {
            store: newStore,
        },
        message: "Store created successfully"
    }));
})

export const dashboard = asyncHandler(async (req: Request, res: Response) => {
    const users = await prisma.user.count();
    const stores = await prisma.store.count();
    const ratings = await prisma.rating.count();

    return res.status(200).json(new ApiResponse({
        statusCode: 200,
        message: "Dashboard data fetched successfully",
        data: {
            totalUsers: users,
            totalStores: stores,
            totalRatings: ratings
        }
    }))
})