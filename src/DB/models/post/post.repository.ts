import { IPost } from "../../../common";
import { AbstractRepo } from "../../abstract.repository";
import { Post } from "./post.model";

export class PostRepo extends AbstractRepo<IPost>{
    constructor(){
        super(Post);
    }
}