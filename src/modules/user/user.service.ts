import {ICloudProvider} from "../../common/cloud/cloud.interface";
import {Types} from "mongoose";
import {s3CloudProvider} from "../../common/cloud/s3/init";

export class UserService{

    constructor(private readonly cloudProvider : ICloudProvider) {
    }

    async uploadFile(file:Express.Multer.File,userId:Types.ObjectId){
        return await this.cloudProvider.uploadFile(file,`users/${userId.toString()}`)
    }
}

export default new UserService(s3CloudProvider)