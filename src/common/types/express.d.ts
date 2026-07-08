import { IUser } from "../interfaces";

declare module "express" {
    interface Request {
        user?:IUser;
    }
}