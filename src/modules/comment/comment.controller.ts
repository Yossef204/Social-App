import {NextFunction, Router, Response, Request} from "express";
import CommentService from "./comment.service";
import {Types} from "mongoose";
import {addReactions} from "../../common/services";
import {isValid} from "../../middlwares";
import {createCommentSchema} from "./comment.validation";
import {CommentRepo} from "../../DB/models/comment/comment.repository";

const router = Router({mergeParams : true})

router.post("/reaction", async (req: Request, res: Response, next: NextFunction) => {
    console.log("1");
    const commentRepo = new CommentRepo();
    await addReactions(req.body,
        new Types.ObjectId("6a1c52f8384310ae4f4ea503"),
        commentRepo)
    return res.sendStatus(204);
})

// ("/comment/:parentId")
// ("/post/postId/comment/:parentId")
router.post("{/:parentId}",/*isValid(createCommentSchema),*/ async (req: Request, res: Response, next: NextFunction) => {
    await CommentService.create(req.body, req.params, new Types.ObjectId("6a1c52f8384310ae4f4ea503"));
    return res.status(201).json({message: "created comment successfully", success: "true"});
})


router.get("/:postId{/:parentId}",/*isValid(createCommentSchema),*/ async (req: Request, res: Response, next: NextFunction) => {
    const data = await CommentService.getAll(req.params);
    return res.status(200).json({data: {data}, success: "true"});
})


router.delete("/:id" , async (req: Request, res: Response, next: NextFunction) => {
    await CommentService.delete(new Types.ObjectId(req.params.id as string), new Types.ObjectId("6a1c52f8384310ae4f4ea503"));
    return res.sendStatus(204)
})
export default router;