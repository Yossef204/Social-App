import {BadRequestException, verifyToken} from "../common";
import {JwtPayload, verify} from "jsonwebtoken"
import {NextFunction, Request, Response} from "express";
import {userRepo} from "../DB/models/user/user.repository";
import {tokenRepo} from "../DB/models/tokens/tokens.repository";

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

    const payload = verifyToken(
        authorization,
         "yossefmoooooooooooo",
    );

    const user = await userRepo.getOne({
        _id: payload.sub,
    });

    if (!user) {
        throw new BadRequestException("invalid id");
    }

    if (
        user.credentialsUpdatedAt.getTime() >
        (payload.iat as number) * 1000
    ) {
        throw new BadRequestException("invalid token");
    }

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

    (req as any).payload = payload;
    (req as any).user = user;

    next();
};