import {AbstractRepo} from "../../abstract.repository";
import {IUserReactions} from "../../../common";
import {UserReactions} from "./user-reactions.model";

export class UserReactionsRepo extends AbstractRepo<IUserReactions>{
    constructor() {
        super(UserReactions);
    }
}