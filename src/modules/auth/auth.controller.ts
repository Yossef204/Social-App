import {
    type NextFunction,
    type Request,
    type Response,
    Router
} from 'express';
import authService from './auth.service';
import { isValid } from '../../middlwares';
import { loginSchema, resetPasswordSchema, signupSchema, verifyAccountSchema } from './auth.validation';

const router = Router();

//signup
router.post('/signup', isValid(signupSchema),async (req: Request, res: Response, next: NextFunction) => {
    //TODO: Implement signup logic
    //call service layer to handle business logic
    const createdUser =await authService.signup(req.body);
    //send response
    res.status(201).json({
        message : "User created successfully",
        success: true,
        data : {createdUser}
    })
})

router.post('/verify-account', isValid(verifyAccountSchema),async (req: Request, res: Response, next: NextFunction) => {
    //TODO: Implement verify-account logic
    //call service layer to handle business logic
    const verifiedUser =await authService.verifyAccount(req.body);
    //send response
    res.status(200).json({
        message : "User verified successfully",
        success: true,
        data : {verifiedUser}
    })
})

router.post('/send-otp', isValid(verifyAccountSchema),async (req: Request, res: Response, next: NextFunction) => {
    //TODO: Implement send-otp logic
    //call service layer to handle business logic
    const createdOTP =await authService.sendOtp(req.body);
    //send response
    res.status(200).json({
        message : "OTP sent successfully",
        success: true,
        data : {createdOTP}
    })
})



router.patch('/reset-password', isValid(resetPasswordSchema),async (req: Request, res: Response, next: NextFunction) => {
    //TODO: Implement reset-password logic
    //call service layer to handle business logic
    const updatedUser =await authService.resetPassword(req.body);
    //send response
    res.status(200).json({
        message : "Password reset successfully",
        success: true,
        data : {updatedUser}
    })
})

export default router;