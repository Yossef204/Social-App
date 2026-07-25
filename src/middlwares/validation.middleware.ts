import {NextFunction, Request, Response} from "express";
import {ZodObject} from "zod";
import {BadRequestException} from "../common";

export const isValid = (schema: ZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errMessages = result.error.issues.map((issue) => ({
                path: issue.path[0] as string,
                message: issue.message
            }))

            throw new BadRequestException("validation error", errMessages,)
        }
        next();
    }
}

export const isValidGql = (schema: ZodObject, args: unknown) => {

    const result = schema.safeParse(args);
    if (!result.success) {
        const errMessages = result.error.issues.map((issue) => ({
            path: issue.path[0] as string,
            message: issue.message
        }))

        throw new BadRequestException("validation error", errMessages,)
    }

}


