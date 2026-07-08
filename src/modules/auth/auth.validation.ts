import z from "zod";
import { generalFields} from "../../common";

export const signupSchema= z.object({
    email : generalFields.email,
    password : generalFields.password,
    userName : generalFields.userName,
    gender : generalFields.gender,
    phoneNumber: generalFields.phoneNumber
})


export const loginSchema = z.object({
    email : generalFields.email,
    password : generalFields.password,
})

export const resetPasswordSchema = z.object({
    email : generalFields.email,
    newPassword : generalFields.password
})

export const verifyAccountSchema = z.object({
    email : generalFields.email
})