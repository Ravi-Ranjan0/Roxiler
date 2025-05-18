import { Request } from "express";

export interface JwtPayload {
    id: number;
    email: string;
    role: string;
}

export interface RequestWithUser extends Request {
    user?: JwtPayload;
}