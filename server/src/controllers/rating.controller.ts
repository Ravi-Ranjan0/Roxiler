import { Request , Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiRespose";
import ApiError from "../utils/ApiError";
import ratingSchema from "../schemas/rating.schema";
import prisma from "../config/prisma";
import { RequestWithUser } from "../utils/interface";

export const giveRating = asyncHandler(async (req: RequestWithUser, res: Response) => {

    let { storeId, rating } = req.body;

    storeId = parseInt(storeId);
    rating = parseInt(rating);

    const isValidData = ratingSchema.safeParse({
        rating
    });

    if (!isValidData.success) {
        const error = isValidData.error.errors[0];
        throw new ApiError(400, {
            message: error.message
        });
    }

    const doesStoreExist = await prisma.store.findUnique({
        where: {
            id: storeId
        }
    });

    if (!doesStoreExist) {
        throw new ApiError(400, {
            message: "Store does not exist"
        });
    }

    if (!req.user) {
        throw new ApiError(401, {
            message: "Not authenticated"
        });
    }

    if (doesStoreExist.ownerId === req.user.id) {
        throw new ApiError(400, {
            message: "You cannot rate your own store"
        });
    }

    const doesRatingExist = await prisma.rating.findFirst({
        where: {
            storeId,
            userId: req.user.id
        }
    });

    if (doesRatingExist) {
        throw new ApiError(400, {
            message: "You have already rated this store"
        });
    }

    await prisma.rating.create({
        data: {
            storeId,
            userId: req.user.id,
            rating
        }
    });

    return res.status(201).json(new ApiResponse({
        statusCode: 201,
        message: "Rating created successfully",
        data: null
    }))
})

export const getStoreRating = asyncHandler(async (req: RequestWithUser, res: Response) => {
    
    const { storeId } = req.params;

    const doesStoreExist = await prisma.store.findUnique({
        where: {
            id: parseInt(storeId)
        }
    });

    if (!doesStoreExist) {
        throw new ApiError(400, {
            message: "Store does not exist"
        });
    }

    const ratings = await prisma.rating.findMany({
        where: {
            storeId: parseInt(storeId)
        } ,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    return res.status(200).json(new ApiResponse({
        statusCode: 200,
        message: "Ratings fetched successfully",
        data: {
            ratings
        }
    }))
})

export const getAllRatings = asyncHandler(async (req : Request , res : Response) => {
    const ratings = await prisma.rating.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            store: {
                select: {
                    id: true,
                    name: true,
                    address: true
                }
            }
        }
    });

    return res.status(200).json(new ApiResponse({
        statusCode: 200,
        message: "Ratings fetched successfully",
        data: {
            ratings
        }
    }))
})


export const modifyRating = asyncHandler(async (req: RequestWithUser, res: Response) => {
    const { ratingId , rating } = req.body;

    const isValidData = ratingSchema.safeParse({
        rating
    });

    if (!isValidData.success) {
        const error = isValidData.error.errors[0];
        throw new ApiError(400, {
            message: error.message
        });
    }

    const doesRatingExist = await prisma.rating.findUnique({
        where: {
            id: parseInt(ratingId)
        }
    });

    if (!doesRatingExist) {
        throw new ApiError(400, {
            message: "Rating does not exist"
        });
    }

    if (doesRatingExist.userId !== req?.user?.id) {
        throw new ApiError(403, {
            message: "You are not authorized to modify this rating"
        });
    }

    await prisma.rating.update({
        where: {
            id: parseInt(ratingId)
        },
        data: {
            rating
        }
    });

    return res.status(200).json(new ApiResponse({
        statusCode: 200,
        message: "Rating updated successfully",
        data: null
    }))
})