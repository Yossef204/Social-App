import {PostRepo} from "../../DB/models/post/post.repository";
import {AddReactionsDTO, CreatePostDTO} from "./post.dto";
import {Types} from "mongoose";
import {NotFoundException} from "../../common";
import {UserReactionsRepo} from "../../DB/models/user-reactions/user-reactions.repository";
import {ON_MODEL} from "../../common";

export class PostService {
    constructor(private readonly postRepo: PostRepo, private readonly userReactionsRepo: UserReactionsRepo) {
    }

    public async create(createPostDTO: CreatePostDTO, userId: Types.ObjectId) {
        // expected userId from headers token but now in developing mood to test features
        return await this.postRepo.create({...createPostDTO, userId});
    }


    public async addReactions(addReactionDTO: AddReactionsDTO, userId: Types.ObjectId) {
        //check post exist
        const postExist = await this.postRepo.getOne({_id: addReactionDTO.postId})
        //if not theow notfound
        if (!postExist) {
            throw new NotFoundException("post not found");
        }
        //if yes check is this user added reaction before
        const reactionExist = await this.userReactionsRepo.getOne({
            onModel: ON_MODEL.post,
            refId: addReactionDTO.postId,
            userId
        })
        //if not add reaction and increment counter in post model
        if (!reactionExist) {
            await this.userReactionsRepo.create({
                refId: addReactionDTO.postId,
                onModel: ON_MODEL.post,
                reactions: addReactionDTO.reaction,
                userId
            })
            await this.postRepo.updateOne({_id: addReactionDTO.postId}, {$inc: {reactionCount: 1}})
            return
        }
        //if yes
        //is same delete reactions and minus counter from post model
        if (String(reactionExist.reactions) === String(addReactionDTO.reaction)) {
            await this.userReactionsRepo.deleteOne({_id: reactionExist._id})
            await this.postRepo.updateOne({_id: addReactionDTO.postId}, {$inc: {reactionCount: -1}})
            const post = await this.postRepo.updateOne(
                {_id: addReactionDTO.postId},
                {$inc: {reactionCount: -1}},
                {new: true}
            );

            if (post && post.reactionCount < 0) {
                post.reactionCount = 0;
                await post.save();
            }

            return;
        }

        //check if reaction in database is different with reaction in body
        //if diff update
        await this.userReactionsRepo.updateOne({_id: reactionExist._id}, {reactions: addReactionDTO.reaction})
        return
    }

    // public async getAllPostsByEmail(getPostDTO:GetPostDTO){
    //     return await this.postRepo.getAll({_id:getPostDTO})
    // }
}

export default new PostService(new PostRepo(), new UserReactionsRepo());

