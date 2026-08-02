import {ICloudProvider} from "../../common/cloud/cloud.interface";
import {Types} from "mongoose";
import {s3CloudProvider} from "../../common/cloud/s3/init";
import {userRepo, UserRepo} from "../../DB/models/user/user.repository";
import {UserFriendRepo} from "../../DB/models/user-friend/user-friend.repository";
import {BadRequestException, NotFoundException} from "../../common";

export class UserService {

    constructor(private readonly cloudProvider: ICloudProvider, private readonly userRepo: UserRepo, private readonly userFriendRepo: UserFriendRepo) {
    }

    async uploadFile(file: Express.Multer.File, userId: Types.ObjectId) {
        return await this.cloudProvider.uploadFile(file, `users/${userId.toString()}`)
    }

    async profile(userId: Types.ObjectId) {
        const user = await this.userRepo.getOne({_id: userId});
        const friends = await this.userFriendRepo.getAll(
            {
                $or: [{
                    userId: userId
                }, {
                    friendId: userId
                }]
            },
            {},
            {
                populate:[{path:"userId"},{path:"friendId"}]
            })
        if (!user && !friends) {
            throw new NotFoundException("there is no friends ");
        }
        return {user, friends};
    }
}

export default new UserService(s3CloudProvider, userRepo, new UserFriendRepo())