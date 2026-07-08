import {model, Schema} from "mongoose";
import {IUserFriend} from "../../../common";

const schema = new Schema<IUserFriend>({
    userId : {type : Schema.Types.ObjectId , ref : "User" , required : true},
    friendId:{type : Schema.Types.ObjectId , ref : "User" , required : true}
},{timestamps:true});

export const UserFriend = model<IUserFriend>("UserFriend",schema);