import { Types } from "mongoose";

export interface IPost{
    userId:Types.ObjectId;
    content:string;
    attachments?:string[];
    reactionCount:number;
    commentCount:number;
    shareCount:number;
}