import { IUser } from "../interfaces";
import { Document, HydratedDocument } from "mongoose";
// export type userDocument = IUser & Document

export type userDocument = HydratedDocument<IUser>
