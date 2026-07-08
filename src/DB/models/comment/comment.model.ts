import {model, Schema} from "mongoose";
import {IComment} from "../../../common";

const schema = new Schema<IComment>({
    userId : {type : Schema.Types.ObjectId , ref : "User" ,required: true},
    postId :{type : Schema.Types.ObjectId , ref : "Post" ,required: true},
    parentId: {type : Schema.Types.ObjectId , ref:"Comment"},
    mentions :[{type : Schema.Types.ObjectId , ref : "User"}],
    content :{type : String},
    attachment : {type : String},
    reactionCount : {type : Number}
},{timestamps : true})

schema.pre("deleteOne",async function (){
    //get all replies
    let filter = this.getFilter() //>> {_id:parentId}
    const replies = await this.model.find({parentId:filter._id}) // >> [{},{},{}] || []
    //if replies >> loop deleteOne
    if(replies.length > 0 ){
        for (const reply of replies) {
            await this.model.deleteOne({_id : reply._id});
        }
    }
    //return
    //next()
})

export const Comment =model<IComment>("Comment" , schema);