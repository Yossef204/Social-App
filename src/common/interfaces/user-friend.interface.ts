import {Types} from "mongoose";

export interface IUserFriend {
    userId : Types.ObjectId;
    friendId : Types.ObjectId;
}