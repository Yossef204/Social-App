import {PostType} from "./post.type";
import {getPost} from "./post.service.gql";

export const PostQuery = {

    product: {
        type: PostType, resolve: getPost
    }
}