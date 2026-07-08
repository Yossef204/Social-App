import {Types} from "mongoose";

export interface CreateCommentDTO{
    content?:string;
    attachment?:string;
    mentions? : Types.ObjectId[]
    // postId >> params
    //parentId >> params
    // userId >> from token >>but now put as parameter in the method untill auth middleware
}