import {Router, Request, Response, NextFunction} from "express";
import PostService from "./post.service";
import {Types} from "mongoose";
import {BadRequestException} from "../../common";
import {createPostSchema} from "./post.validation";
import {isValid} from "../../middlwares";
import {addReactions} from "../../common/services";
import {PostRepo} from "../../DB/models/post/post.repository";
import {default as commentRouter} from "../comment/comment.controller";
const router = Router()
router.use("/:postId/comment" , commentRouter)
router.post('/create', isValid(createPostSchema), async (req: Request, res: Response, next: NextFunction) => {
    //create post from post service class
    const postCreated = await PostService.create(req.body, new Types.ObjectId("6a1c52f8384310ae4f4ea503"))
    if (!postCreated) {
        throw new BadRequestException("Error creating Post");
    }
    return res.status(201).json({message: "post created successfully", success: "true", data: {postCreated}})
})

router.post('/reaction', async (req: Request, res: Response, next: NextFunction) => {

    // await PostService.addReactions(req.body,new Types.ObjectId("6a1c52f8384310ae4f4ea503"))
    const postRepo = new PostRepo();
    await addReactions(req.body,new Types.ObjectId("6a1c52f8384310ae4f4ea503"),postRepo)
    return res.sendStatus(200);
});

export default router