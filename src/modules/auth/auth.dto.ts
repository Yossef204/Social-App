import { z } from "zod";
import { SYS_GENDER } from "../../common";
import { loginSchema, signupSchema } from "./auth.validation";

// classes , interfaces , types >> is named by noun not verb by convention >> but skipped in DTOs because they are not used as types but as data transfer objects

export type SignupDTO = z.infer<typeof signupSchema>;

// export interface SignupDTO {
//     email: string;
//     password: string;
//     userName: string;
//     phoneNumber?: string;
//     gender:SYS_GENDER;
// }

export type LoginDTO = z.infer<typeof loginSchema>;

// export interface LoginDTO {
//     email: string;
//     password: string;
// }

export interface VerifyAccountDTO {
    email: string;
    otp: string;
}
export interface ForgetPasswordDTO {
    email: string;
}

export interface SendOtpDTO {
    email: string;
}
export interface ResetPasswordDTO {
    email: string;
    otp: string;
    newPassword: string;
}