import {Router, Request, Response, NextFunction} from "express";
import RequestService from "./request.service";
import {Types} from "mongoose";

const router = Router();

router.post("/:receiverId", async (req: Request, res: Response, next: NextFunction) => {
    const request = await RequestService.send(new Types.ObjectId("6a3854ee17922c78a2b34d45")
        ,new Types.ObjectId(req.params.receiverId as string ));
    return res.sendStatus(204)
})

// router.post("");
router.post("/accept/:id",async (req : Request,res : Response,next : NextFunction)=>{
    const requestAccepted = await RequestService.accept(
         new Types.ObjectId("6a1c52f8384310ae4f4ea503")
        ,new Types.ObjectId(req.params.id as string))
    return res.sendStatus(204);
})

router.delete("/decline/:id",async (req : Request,res : Response,next : NextFunction)=>{
    const requestDeclined = await RequestService.decline(
        new Types.ObjectId("6a1c52f8384310ae4f4ea503")
        ,new Types.ObjectId(req.params.id as string))
    return res.sendStatus(204);
})


router.delete("/remove/:userId",async (req : Request,res : Response,next : NextFunction)=>{
    const requestDeclined = await RequestService.removeFriend(
        new Types.ObjectId("6a3854ee17922c78a2b34d45")
        ,new Types.ObjectId(req.params.userId as string))
    return res.sendStatus(204);
})

export default router;