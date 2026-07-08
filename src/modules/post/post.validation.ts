import z from "zod";
import {BadRequestException, generalFields} from "../../common";

export const createPostSchema = z.object({
    content : generalFields.content,
    attachments : generalFields.attachments
}).refine((data)=>{
    const {content , attachments} = data ;
    if(!content && (!attachments || attachments.length == 0 )){
       throw new BadRequestException('content or attachment must be provided');
    }
    return true;
})