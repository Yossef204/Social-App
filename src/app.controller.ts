// @ts-ignore
import express, {NextFunction, Request, Response} from "express";
import {authRouter, commentRouter, postRouter, requestRouter, userRouter} from "./modules/index";
import {BadRequestException, NotFoundException} from "./common";
import {connectDB, connectRedis} from "./DB";
import {s3CloudProvider} from "./common/cloud/s3/init";
import {pipeline} from "node:stream";
import {promisify} from "node:util";
import {createHandler} from "graphql-http/lib/use/express";
import {GraphQLObjectType, GraphQLSchema} from "graphql/type";
import {UserQuery} from "./modules/user/graphql/user.gql";
import {PostMutation, PostQuery} from "./modules/post/graphql/post.gql";
import {RealtimeGateway} from "./common/realtimeGateway/realtime.gateway";
import cors from 'cors';
const pipeLinePromise = promisify(pipeline);

export function bootstrap() {

    const app = express();
    const port = 3000;
    app.use(express.json());
    app.use(cors({
        origin : "*"
    }))
    connectDB();
    connectRedis();
    let mutation = new GraphQLObjectType({
        name : "RootUser",
        fields : {
            // ...UserMutation,
            ...PostMutation
        }

    })
    let query = new GraphQLObjectType({
        name: "RootQuery",
        fields: {
            ...UserQuery,
            ...PostQuery
            // category: {type, resolve},
            // reviews: {type, resolve}
        }
    })
    let schema = new GraphQLSchema({
        query,
        mutation
    })
    app.use('/graphql', createHandler({
        context:(req)=>{
            const headers = req.headers;
            return {headers }
        }
        ,schema}));
    app.get('/uploads/*paths', async (req: Request, res: Response, next: NextFunction) => {
        let key = (req.params.paths as string[]).join('/');
        const fileExist = await s3CloudProvider.getFile(key);
        if (!fileExist) {
            throw new NotFoundException("NO FILE ");
        }
        await pipeLinePromise(fileExist, res);
    })
    app.use("/auth", authRouter);
    app.use("/post", postRouter);
    app.use("/comment", commentRouter);
    app.use("/request", requestRouter);
    app.use("/user", userRouter);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        return res.status(err.cause as number || 500).json({
            message: err.message,
            success: false,
            details: err instanceof BadRequestException ? err.details : undefined
        })
    })
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    const realtimeGateway = new RealtimeGateway(server);
    const io = realtimeGateway.io
}
