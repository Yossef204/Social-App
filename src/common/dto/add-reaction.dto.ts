import {Types} from "mongoose";
import {SYS_REACTIONS} from "../enums";

export interface AddReactionsDTO{
    id : Types.ObjectId;
    reaction : SYS_REACTIONS;
}