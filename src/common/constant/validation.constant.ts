import { z } from "zod";
import { SYS_GENDER } from "../enums";

export const generalFields = {
  email: z.email().trim().toLowerCase(),
  password: z
    .string()
    .regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/),
  userName: z.string().min(2).max(100).trim().toUpperCase(),
  gender: z.enum(SYS_GENDER).optional(),
  phoneNumber: z
    .string()
    .regex(/^01[0125]{1}[0-9]{8}$/)
    .optional(),
  content : z.string().min(3).max(500).trim().optional(),
  attachments : z.array(z.string()).optional(),
};
