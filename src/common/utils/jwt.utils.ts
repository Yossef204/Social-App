import jwt, { JwtPayload, SignOptions, Secret } from "jsonwebtoken";
import crypto from "crypto";
import {IUserPayload} from "../../middlwares";

export function signToken(
    payload: JwtPayload,
    secret: Secret,
    options?: SignOptions,
): string {
    payload.jti = crypto.randomBytes(16).toString("hex");

    return jwt.sign(payload, secret, options);
}

export function verifyToken(
    token: string,
    secret: Secret,
): IUserPayload {
    return jwt.verify(token, secret) as IUserPayload;
}

export function generateTokens(payload: JwtPayload): {
    accessToken: string;
    refreshToken: string;
} {
    const accessToken = signToken(
        payload,
        "yossefmoooooooooooo",
        { expiresIn: "15m" },
    );

    const refreshToken = signToken(
        payload,
        "yossefmoooooooooooo",
        { expiresIn: "1y" },
    );

    return {
        accessToken,
        refreshToken,
    };
}