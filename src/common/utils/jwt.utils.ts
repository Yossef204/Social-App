import jwt, { JwtPayload, SignOptions, Secret } from "jsonwebtoken";
import crypto from "crypto";

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
): JwtPayload {
    return jwt.verify(token, secret) as JwtPayload;
}

export function generateTokens(payload: JwtPayload): {
    accessToken: string;
    refreshToken: string;
} {
    const accessToken = signToken(
        payload,
        "YoSSEFMOOOOOOOOOOOOO",
        { expiresIn: 60 },
    );

    const refreshToken = signToken(
        payload,
        "YoSSEFMOOOOOOOOOOOOO",
        { expiresIn: "1y" },
    );

    return {
        accessToken,
        refreshToken,
    };
}