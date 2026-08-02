import { IUser } from "../interfaces";
import {IUserPayload} from "../../middlwares";

declare module "express" {
    interface Request {
        user?:IUserPayload
        payload?: IUserPayload;
    }
}