import {model, Schema} from "mongoose";
import {IUserReactions , SYS_REACTIONS, ON_MODEL} from "../../../common";

const schema = new Schema<IUserReactions>({
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    refId: {type: Schema.Types.ObjectId, refPath: "onModel", required: true},
    reactions: {type: Number, enum: SYS_REACTIONS, default: SYS_REACTIONS.like},
    onModel: {type: String, enum: ON_MODEL , required: true}
}, {timestamps: true});

export const UserReactions = model<IUserReactions>("UserReactions", schema);
