import {NextFunction, Request, Response, Router} from "express";
import userService from "./user.service";
import {Types} from "mongoose";
import {uploadFile} from "../../common/utils/multer.utils";

const router = Router();

router.post('/profile-pic',uploadFile().single('profilePic') ,async (req : Request,res : Response,next : NextFunction)=>{
   const url =  await userService.uploadFile(req.file as Express.Multer.File , new Types.ObjectId("6a3854ee17922c78a2b34d45"))
    return res.status(200).json({success : true , data : url })
})


export default router;
