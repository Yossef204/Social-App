import {model, Schema} from "mongoose";
import {IUser, SYS_GENDER, SYS_PROVIDER, SYS_ROLE} from "../../../common";

const schema = new Schema<IUser>(
    {
        userName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {
            type: String,
            required: function () {
                if (this.provider == SYS_PROVIDER.google) {
                    return false;
                }
                return true;
            },
        },
        phoneNumber: {type: String},
        gender: {
            type: Number,
            required: true,
            enum: SYS_GENDER,
            default: SYS_GENDER.male,
        },
        role: {type: Number, enum: SYS_ROLE, default: SYS_ROLE.user},
        provider: {
            type: Number,
            enum: SYS_PROVIDER,
            default: SYS_PROVIDER.system,
        },
        profilePic: {type: String},
        credentialsUpdatedAt: {type: Date, default: Date.now()},
    },
    {timestamps: true}
);
export const User = model<IUser>("User", schema);
