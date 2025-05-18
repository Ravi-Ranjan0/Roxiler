import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiRespose";
import prisma from "../config/prisma";
import { RequestWithUser } from "../utils/interface";
import ApiError from "../utils/ApiError";


export const getAllStores = asyncHandler(async (req: RequestWithUser, res: Response) => {

    const storeRatings = await prisma.rating.groupBy({
        by: ['storeId'],
        _avg: {
            rating: true,
        },
    });


    const stores = await prisma.store.findMany({
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    address: true
                }
            }
        }
    });

    const storesWithAvgRating = stores.map(store => {
        const storeRating = storeRatings.find(r => r.storeId === store.id);
        return {
            ...store,
            averageRating: storeRating?._avg?.rating ?? null
        };
    });

    return res.status(200).json(new ApiResponse({
        statusCode: 200,
        message: "Stores fetched successfully",
        data: {
            stores: storesWithAvgRating
        }
    }))
});

export const getAllTheUsersWhoHaveRatedAStore = asyncHandler(async (req: Request, res: Response) => {
    const { storeId } = req.params;
    const storeIdInt = parseInt(storeId);

    const doesStoreExist = await prisma.store.findUnique({
        where: {
            id: storeIdInt
        }
    });

    if (!doesStoreExist) {
        throw new ApiError(400, {
            message: "Store does not exist"
        });
    }

    // Fetch all individual ratings with user info
    const ratings = await prisma.rating.findMany({
        where: {
            storeId: storeIdInt
        },
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

    // Fetch the average rating using aggregation
    const average = await prisma.rating.aggregate({
        where: {
            storeId: storeIdInt
        },
        _avg: {
            rating: true
        }
    });

    return res.status(200).json(new ApiResponse({
        statusCode: 200,
        message: "Ratings fetched successfully",
        data: {
            averageRating: average._avg.rating ?? null,
            ratings
        }
    }));
});
