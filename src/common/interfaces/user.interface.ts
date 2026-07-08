import {SYS_GENDER, SYS_PROVIDER, SYS_ROLE} from "../enums";

export interface IUser {
  email: string;
  password: string;
  userName: string;
  phoneNumber?: string | undefined;
  gender: SYS_GENDER | undefined;
  role: SYS_ROLE;
  provider: SYS_PROVIDER;
  profilePic?: string;
}