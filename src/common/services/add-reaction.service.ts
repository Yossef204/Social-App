import {AddReactionsDTO} from "../dto";
import {Types} from "mongoose";
import {CommentRepo} from "../../DB/models/comment/comment.repository";
import {PostRepo} from "../../DB/models/post/post.repository";
import {BadRequestException, NotFoundException} from "../utils";
import {UserReactionsRepo} from "../../DB/models/user-reactions/user-reactions.repository";
import {ON_MODEL} from "../enums";

const toModel = (collectionName : string) => {
    switch (collectionName) {
        case ("posts"):
            return ON_MODEL.post
        case ("comments"):
            return ON_MODEL.comment;
        default:
            throw new BadRequestException("invalid model");
    }
}


export const addReactions = async (
    addReactionDTO: AddReactionsDTO
    ,userId: Types.ObjectId ,
    repo :  CommentRepo | PostRepo
) => {
    //check post exist
    const docExist = await repo.getOne({_id: addReactionDTO.id})
    //if not theow notfound
    if (!docExist) {
        throw new NotFoundException("document not found");
    }
    const collectionName = docExist.collection.name;
    const userReactionsRepo = new UserReactionsRepo();
    //if yes check is this user added reaction before
    const reactionExist = await userReactionsRepo.getOne({
        onModel: toModel(collectionName),
        refId: addReactionDTO.id,
        userId
    })
    //if not add reaction and increment counter in post model
    if (!reactionExist) {
        await userReactionsRepo.create({
            refId: addReactionDTO.id,
            onModel: toModel(collectionName),
            reactions: addReactionDTO.reaction,
            userId
        })
        await repo.updateOne({_id: addReactionDTO.id}, {$inc: {reactionCount: 1}})
        return
    }
    //if yes
    //is same delete reactions and minus counter from post model
    if (String(reactionExist.reactions) === String(addReactionDTO.reaction)) {
        await repo.deleteOne({_id: reactionExist._id})
        await repo.updateOne({_id: addReactionDTO.id}, {$inc: {reactionCount: -1}})
        const post = await repo.updateOne(
            {_id: addReactionDTO.id},
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
    await userReactionsRepo.updateOne({_id: reactionExist._id}, {reactions: addReactionDTO.reaction})
    return
}