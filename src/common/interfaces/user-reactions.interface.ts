import { Types } from "mongoose";
import { ON_MODEL, SYS_REACTIONS } from "../../common";


export interface IUserReactions{
    userId : Types.ObjectId;
    refId : Types.ObjectId;
    reactions : SYS_REACTIONS;
    onModel : ON_MODEL;
} 