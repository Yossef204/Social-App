import { model, Schema } from "mongoose";
import { IPost } from "../../../common";

const schema = new Schema<IPost>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    attachments: [String],
    reactionCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Post = model<IPost>("Post", schema);
