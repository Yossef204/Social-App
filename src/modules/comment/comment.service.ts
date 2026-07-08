import {CommentRepo} from "../../DB/models/comment/comment.repository";
import {PostRepo} from "../../DB/models/post/post.repository";
import {CreateCommentDTO} from "./comment.dto";
import {Types} from "mongoose";
import {IPost, NotFoundException, UnauthorizedException} from "../../common";

export class CommentService {
    // create comment
    constructor(private readonly commentRepo: CommentRepo
        , private readonly postRepo: PostRepo) {
    }

    public async create(createCommentDTO: CreateCommentDTO, params: any, userId: Types.ObjectId) {
        if (params.postId) {
            // check post exist
            const postExist = await this.postRepo.getOne({_id: params.postId})
            //if no throw error
            if (!postExist) {
                throw new NotFoundException("post not exist");
            }
        }
        //if parentId >> reply >> check this parentId exist in comment
        let commentExist = undefined;
        if (params.parentId) {
            commentExist = await this.commentRepo.getOne({_id: params.parentId})
            if (!commentExist) {
                throw new NotFoundException("no comment to reply");
            }
        }
        //if yes create
        return await this.commentRepo.create({
            ...createCommentDTO, ...params,
            userId,
            postId: params.postId || commentExist?.postId
        })
    }

    public async getAll(params: any) {
        const res = await this.commentRepo.getAll({postId: params.postId, parentId: params.parentId})
        if (!res || res.length == 0) {
            throw new NotFoundException("no comments")
        }
        return res
    }


    public async delete(id : Types.ObjectId , userId : Types.ObjectId){
        //check commentExist
        const commentExist = await this.commentRepo.getOne({_id:id} , {} , {populate : [{path : "postId" }]});
        if(!commentExist){
            throw new NotFoundException("comment not found");
        }
        //commentAuthor
        let commentAuthor = commentExist.userId.toString() ;
        //postAuthor
        let postAuthor = (commentExist.postId as IPost[])[0]?.userId.toString();
        if(userId.toString() != commentAuthor && userId.toString() != postAuthor){
            throw new UnauthorizedException("not allowed to delete this comment");
        }
        return  await this.commentRepo.deleteOne({_id : id})
    }

}

export default new CommentService(new CommentRepo(), new PostRepo())