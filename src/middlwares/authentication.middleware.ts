import {BadRequestException, verifyToken} from "../common";
import {JwtPayload, verify} from "jsonwebtoken"
import {NextFunction, Request, Response} from "express";
import {userRepo} from "../DB/models/user/user.repository";
import {tokenRepo} from "../DB/models/tokens/tokens.repository";

export interface IUserPayload extends JwtPayload {
    sub: string;
    email: string;
}



export const isAuthGQL = (context: any) => {
    const authorization = context.headers.authorization;
    const token = authorization.split(' ')[1];
    if (!token) {
        throw new BadRequestException("no token")
    }
    const payload = verify(token, "ajckdlhhlhkhsdhojfg") as JwtPayload;
    return context.payload = payload;
}

export const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const {authorization} = req.headers;

    if (!authorization) {
        throw new BadRequestException("Authorization header is required");
    }
    const token = authorization.startsWith("Bearer ")
        ? authorization.split(" ")[1]
        : authorization;
    const payload = verifyToken(
        token as string,
        "yossefmoooooooooooo",
    );


    const jti = payload.jti;

    if (!jti) {
        throw new BadRequestException("Invalid token");
    }

    const blacklistedToken = await tokenRepo.getOne({
        token: jti,
    });

    if (blacklistedToken) {
        throw new BadRequestException("invalid token");
    }

    req.payload = payload;
    req.user = payload ;
    next();
};