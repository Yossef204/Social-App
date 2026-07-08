import { IUser } from "../../../common";
import { AbstractRepo } from "../../abstract.repository";
import { User } from "./user.model";

export class UserRepo extends AbstractRepo<IUser>{
    constructor(){
        super(User);
    }
}

export const userRepo = new UserRepo()