import {Types} from "mongoose";
import {SYS_REACTIONS} from "../../common";

export interface CreatePostDTO{
    content:string,
    attachments?:string[],
    //userId from req.user.id
}

export interface AddReactionsDTO{
    postId : Types.ObjectId;
    reaction : SYS_REACTIONS;
}

// export interface GetPostDTO{
//     id : Types.ObjectId
// }