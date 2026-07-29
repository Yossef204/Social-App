import { Schema, model, Types, InferSchemaType } from "mongoose";

const tokenSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        expiresAt: {
            type: Date,
            index: {
                expires: 0,
            },
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export type TokenDocument = InferSchemaType<typeof tokenSchema> & {
    _id: Types.ObjectId;
};

export const TokenModel = model<TokenDocument>("Token", tokenSchema);