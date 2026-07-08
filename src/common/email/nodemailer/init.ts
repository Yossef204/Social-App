import {NodemailerProvider} from "./nodemailer.service";
import {DB_EMAIL, PASSWORD_EMAIL_NODEMAILER} from "../../../config";

export const nodeMailerProvider = new NodemailerProvider({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: DB_EMAIL,
        pass: PASSWORD_EMAIL_NODEMAILER,
    }
})