import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError";
import { config } from "../config/env";
import { Response, NextFunction } from "express";
import { RequestWithUser, JwtPayload } from "../utils/interface";


const authenticate = (req: RequestWithUser, res: Response, next: NextFunction) => {
    let token = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return next(new ApiError(401, { message: "Not authenticated" }));
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    
        req.user = decoded; // Attach user info to request object
        next();
    } catch (error) {
        return next(new ApiError(401, { message: "Invalid token" }));
    }
};

export default authenticate;