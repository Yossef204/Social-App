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
import {UserMutation, UserQuery} from "./modules/user/graphql/user.gql";
import {PostQuery} from "./modules/post/graphql/post.gql";

const pipeLinePromise = promisify(pipeline);

export function bootstrap() {

    const app = express();
    const port = 3000;
    app.use(express.json());

    connectDB();
    connectRedis();
    let mutation = new GraphQLObjectType({
        name : "RootUser",
        fields : {
            ...UserMutation
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
    app.use('/graphql', createHandler({schema}));
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
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
