import {AbstractRepo} from "../../abstract.repository";
import {IComment} from "../../../common";
import {Comment} from "./comment.model";

export class CommentRepo extends AbstractRepo<IComment>{
    constructor(){
        super(Comment);
    }
}

export const commentRepo = new CommentRepo();