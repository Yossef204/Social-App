import {PostType} from "./post.type";
import {getPost} from "./post.service.gql";
import {GraphQLList, GraphQLString} from "graphql/type";
import postService from "../post.service";
import {Types} from "mongoose";
import {isAuthGQL, isValidGql} from "../../../middlwares";
import {createPostSchema} from "../post.validation";

export const PostQuery = {

    post: {
        type: PostType, resolve: getPost
    }
}

export const PostMutation = {
    addPost : {
        type: PostType,
        args : {
            content : {type : GraphQLString},
            attachments : {type :new GraphQLList(GraphQLString)},
            userId : {type : GraphQLString}
        },
        resolve:async (_:any,args:{content : string,attachments:string[] ,userId : string },context)=>{
            isAuthGQL(context);
            await isValidGql(createPostSchema,args)
            return await postService.create(args,new Types.ObjectId(args.userId));
        }
    }
}