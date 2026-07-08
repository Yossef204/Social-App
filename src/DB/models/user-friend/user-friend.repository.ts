import {AbstractRepo} from "../../abstract.repository";
import {IUserFriend} from "../../../common";
import {UserFriend} from "./user-friend.model";

export class UserFriendRepo extends AbstractRepo<IUserFriend> {
    constructor() {
        super(UserFriend);
    }
}

// export default new UserFriendRepo();