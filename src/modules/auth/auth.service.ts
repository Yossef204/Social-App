//class service for auth
//using class to follow nestJs style >> dependency injection and separation of concerns

import {
  BadRequestException, compare,
  ConflictException,
  encrypt,
  generateOtp, generateTokens,
  hash,
  sendMail, signToken,
} from "../../common";
import { UserRepo } from "../../DB/models/user/user.repository";
import {
  ForgetPasswordDTO,
  LoginDTO,
  ResetPasswordDTO,
  SendOtpDTO,
  SignupDTO,
  VerifyAccountDTO,
} from "./auth.dto";
import {
  deleteFromCache,
  getFromCache,
  redisClient,
  setIntoCache,
} from "../../DB";
import {NodemailerProvider} from "../../common/email/nodemailer/nodemailer.service";
import {IMailProvider} from "../../common/email/email.interface";
import {nodeMailerProvider} from "../../common/email/nodemailer/init";

//singleton pattern >> only one instance of this class will be created and shared across the application
class AuthService {
  private userRepo: UserRepo;

  constructor(private mailProvider : IMailProvider) {
    this.userRepo = new UserRepo();
  }

  //signup method
  async signup(signupDTO: SignupDTO) {
    const { email } = signupDTO;
    //check if user already exists
    const userExist = await this.userRepo.getOne({ email });
    if (userExist) {
      throw new ConflictException("User already exists");
    }
    //hash password
    signupDTO.password = await hash(signupDTO.password);
    if (!signupDTO.password) {
      throw new BadRequestException("Error hashing password");
    }
    //encrypt phone number
    if (signupDTO.phoneNumber) {
      signupDTO.phoneNumber = encrypt(signupDTO.phoneNumber as string);
    }
    //generate otp
    const otp = generateOtp();
    //send otp to user
    // await sendMail({
    //   to: email,
    //   subject: "Verify your account",
    //   html: `<p>Your OTP is ${otp}</p>`,
    // });
    await this.mailProvider.send(signupDTO.email,"Verify your account",`<p>Your OTP is ${otp}</p>`)
    //create user into redis databse
    await setIntoCache(`otp:${email}`, otp, { EX: 3 * 60 });
    await setIntoCache(`signup:${email}`, JSON.stringify(signupDTO), {
      EX: 60 * 60,
    });
    //verify account

    //if verified then create user into mongo database
  }
  async verifyAccount(verifyAccountDTO: VerifyAccountDTO) {
    //check user exist in cache
    const user = await redisClient.get(`signup:${verifyAccountDTO.email}`);
    //if not exist throw error
    if (!user) {
      throw new BadRequestException("Invalid email");
    }
    //if exist check otp is correct or not
    //if otp is incorrect throw error
    const otp = await redisClient.get(`otp:${verifyAccountDTO.email}`);
    if (otp != verifyAccountDTO.otp || !otp) {
      throw new BadRequestException("Invalid OTP");
    }
    //if otp is correct then create user into mongo database using data from cache and delete cache
    const createdUser = await this.userRepo.create(JSON.parse(user));
    await deleteFromCache(`signup:${verifyAccountDTO.email}`);
    await deleteFromCache(`otp:${verifyAccountDTO.email}`);
    return createdUser;
  }
  //login method
  async login(loginDTO: LoginDTO) {
    const { email, password } = loginDTO;

    const user = await this.userRepo.getOne({
      email,
    });

    const match = await compare(
        password,
        user?.password || "dummy_password",
    );

    if (!user || !match) {
      throw new BadRequestException("Invalid credentials");
    }

    const {accessToken , refreshToken} =  generateTokens({
      sub: user._id.toString(),
      email: user.email,
    });
    return {accessToken,refreshToken}
  }
  //logout method
  logout() {}
  //send otp method
  async sendOtp(sendOtpDTO: SendOtpDTO) {
    //check user exist or not in mongo
    const userExistDb = await this.userRepo.getOne({ email: sendOtpDTO.email });
    //check user exist or not in redis
    const userExistCache = await getFromCache(`signup:${sendOtpDTO.email}`);
    //if not exist throw error
    if (!userExistDb && !userExistCache) {
      throw new BadRequestException("please signup first");
    }
    //if otp expires throw error
    const otpExist = await getFromCache(`otp:${sendOtpDTO.email}`);
    if (otpExist) {
      throw new BadRequestException(
        "OTP already sent, please wait for some time"
      );
    }
    //generate otp
    const otp = generateOtp();
    // send otp to user
  //     await sendMail({
  //       to: sendOtpDTO.email,
  //       subject: "Your OTP for password reset",
  //       html: `<p>Your OTP is ${otp}</p>`,
  // });
    await this.mailProvider.send(sendOtpDTO.email,"Your OTP for password reset",`<p>Your OTP is ${otp}</p>`)
    //store otp in redis
    await setIntoCache(`otp:${sendOtpDTO.email}`, otp, { EX: 3 * 60 });
  }
  //reset password method
  async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
    //check user exist or not in mongo
    const userExistDb = await this.userRepo.getOne({
      email: resetPasswordDTO.email,
    });
    const userExistCache = await getFromCache(
      `signup:${resetPasswordDTO.email}`
    );
    //if no check user exist or not in redis
    //if not exist throw error
    if (!userExistDb && !userExistCache) {
      throw new BadRequestException("Invalid email");
    }
    // if exist check otp is correct or not
    const otpExist = await getFromCache(`otp:${resetPasswordDTO.email}`);
    // if otp is incorrect throw error
    if (!otpExist || otpExist != resetPasswordDTO.otp) {
      throw new BadRequestException("Invalid OTP");
    }
    // if otp is correct then hash new password and update in mongo database and delete cache
    resetPasswordDTO.newPassword = await hash(resetPasswordDTO.newPassword);
    await this.userRepo.updateOne(
      { email: resetPasswordDTO.email },
      { password: resetPasswordDTO.newPassword }
    );
    await deleteFromCache(`otp:${resetPasswordDTO.email}`);
  }
}

export default new AuthService(nodeMailerProvider);
