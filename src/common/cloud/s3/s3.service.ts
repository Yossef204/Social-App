import {ICloudProvider} from "../cloud.interface";
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import {DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {S3_BUCKET_NAME} from "../../../config";

interface Config{
    region : string;
    credentials : {
        accessKeyId : string;
        secretAccessKey : string;
    }
}

export class S3CloudProvider implements ICloudProvider{
    private  Client : S3Client
    constructor(config : Config) {
        this.Client = new S3Client({
            region:config.region,
            credentials:{
                accessKeyId : config.credentials.accessKeyId,
                secretAccessKey : config.credentials.secretAccessKey
            }
        })
    }


    async deleteFile(key: string): Promise<boolean> {
        let command = new DeleteObjectCommand({
            Bucket:S3_BUCKET_NAME,
            Key:key
        })
        const {DeleteMarker} = await this.Client.send(command);
        return DeleteMarker as boolean;
    }

    async getFile(key: string): Promise<NodeJS.ReadableStream | undefined> {
        let command = new GetObjectCommand({
            Bucket:S3_BUCKET_NAME,
            Key:key
        })
        const{Body}=await this.Client.send(command);
        return Body as NodeJS.ReadableStream ;
    }

    async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
        let command =new PutObjectCommand({
            Bucket:S3_BUCKET_NAME,
            Key:`SOCIAL-APP/${path}/${Date.now()}_${file.originalname}`,
            ACL:"private",
            ContentType:file.mimetype,
            // Body:file.buffer
        })
        // await this.Client.send(command);
        // return command.input.Key as string;
        return await getSignedUrl(this.Client, command, {expiresIn: 1800})
    }

}