// @ts-ignore
import express, { NextFunction, Request, Response } from "express";
import {authRouter, commentRouter, postRouter, requestRouter, userRouter} from "./modules/index";
import {BadRequestException, NotFoundException} from "./common";
import { connectDB , connectRedis } from "./DB";
import {s3CloudProvider} from "./common/cloud/s3/init";
import {pipeline} from "node:stream";
import {promisify} from "node:util";

const pipeLinePromise = promisify(pipeline);
export function bootstrap() {
    const app = express();
    const port = 3000;
    connectDB();
    connectRedis();
    app.use(express.json());
    app.get('/uploads/*paths',async (req : Request,res : Response,next : NextFunction)=>{
        let key = (req.params.paths as string[]).join('/');
        const fileExist = await s3CloudProvider.getFile(key);
        if(!fileExist){
            throw new NotFoundException("NO FILE ");
        }
        await pipeLinePromise(fileExist,res);
    })
    app.use("/auth", authRouter);
    app.use("/post",postRouter);
    app.use("/comment",commentRouter);
    app.use("/request",requestRouter);
    app.use("/user",userRouter);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        return res.status(err.cause as number || 500).json({
            message: err.message,
            success: false,
            details: err instanceof BadRequestException ? err.details : undefined
        })
    })
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
