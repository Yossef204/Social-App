import {GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString} from "graphql/type";

export const PostType = new GraphQLObjectType({
    name: "ProductQuery"
    , fields:
        {
            id : {type : GraphQLID},
            content : {type : GraphQLString},
            attachments : {type :new GraphQLList(GraphQLString)},
            userId : { type : GraphQLID},
        }
})