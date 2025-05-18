import ApiError from "../utils/ApiError";
import { Response, NextFunction } from "express";
import { RequestWithUser } from "../utils/interface";


const isAdmin = (req: RequestWithUser, res: Response, next: NextFunction) => {

    
    if (!req.user) {
        return next(new ApiError(401, { message: "Not authenticated" }));
    }

    if (req.user.role !== "ADMIN") {
        return next(new ApiError(403, { message: "Not authorized" }));
    }

    next();
};


export const isStoreOwner = (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ApiError(401, { message: "Not authenticated" }));
    }   

    if (req.user.role !== "STORE_OWNER") {
        return next(new ApiError(403, { message: "Not authorized" }));
    }
    next();
};

export default isAdmin;