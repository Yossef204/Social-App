import {RequestRepo} from "../../DB/models/request/request.repository";
import {BadRequestException} from "../../common";
import {Types} from "mongoose";
import {UserFriendRepo} from "../../DB/models/user-friend/user-friend.repository";

export class RequestService {
    constructor(private readonly requestRepo: RequestRepo, private readonly userFriendRepo: UserFriendRepo) {
    }

    /**
     * @param senderId >> send request >> from token
     * @param receiverId >> from params
     *
     **/
    async send(senderId: Types.ObjectId, receiverId: Types.ObjectId) {
        // if in user-friend
        const userFriendExist = await this.userFriendRepo.getOne({
            $or: [{
                userId: receiverId,
                friendId: senderId
            }, {
                userId: senderId,
                friendId: receiverId
            }]
        })
        if (userFriendExist) {
            throw new BadRequestException("Already friends");
        }
        // if in block table
        // check if any request before
        const requestExist = await this.requestRepo.getOne({
            $or: [{
                sender: senderId,
                receiver: receiverId
            }, {
                sender: receiverId,
                receiver: senderId
            }]
        })
        // if yes throw err there is existing request
        if (senderId.toString() == receiverId.toString()) {
            throw new BadRequestException("not allowed to send request to your email");
        }
        if (requestExist) {
            throw new BadRequestException("already has requested");
        }
        // if no create request
        return await this.requestRepo.create({sender: senderId, receiver: receiverId})
    }


    /**
     * @param userId >> receiver
     * @param id >> requestId
     **/
    async accept(userId: Types.ObjectId, id: Types.ObjectId) {
        //check request exists
        const requestExist = await this.requestRepo.getOne({_id: id});
        //if no throw error
        if (!requestExist) {
            throw new BadRequestException("there is no request ");
        }
        //if yes check if the userId is receiver
        //if no error
        if (userId.toString() != requestExist.receiver.toString()) {
            throw new BadRequestException("YOU ARE NOT ALLOWED TO ACCEPT REQUEST")
        }
        //create userFreind
        const userFriend = await this.userFriendRepo.create({userId: userId, friendId: requestExist.sender})
        //if yes delete request
        return await this.requestRepo.deleteOne({_id: id})
    }

    /**
     * @param userId >> receiver >> token
     * @param id >> requestId
     **/
    async decline(userId: Types.ObjectId, id: Types.ObjectId) {
        //check request exists
        const requestExist = await this.requestRepo.getOne({_id: id});
        //if no throw error
        if (!requestExist) {
            throw new BadRequestException("there is no request ");
        }
        // check userId if sender or receiver
        //if no error
        if (userId.toString() != (requestExist.receiver.toString() && requestExist.sender.toString())) {
            throw new BadRequestException("YOU ARE NOT ALLOWED TO DECLINE REQUEST")
        }
        // delete request
        return this.requestRepo.deleteOne({_id: id})
    }

    /**
     * @param userId >> token
     * @param friendId >> requestId
     **/

    async removeFriend(userId: Types.ObjectId, friendId: Types.ObjectId) {
        if(userId.toString() == friendId.toString()) {
            throw new BadRequestException("You are not allowed to remove friend ");
        }
        const deletedCount = await this.userFriendRepo.deleteOne({
            $or: [{
                friendId: friendId,
                userId: userId
            },
                {
                    friendId: userId,
                    userId: friendId
                }]
        })
        if (!deletedCount) {
            throw new BadRequestException("you are not friends ");
        }
    }
}


export default new RequestService(new RequestRepo(), new UserFriendRepo());