import {GraphQLID, GraphQLObjectType, GraphQLString} from "graphql/type";

export const PostType = new GraphQLObjectType({
    name: "ProductQuery"
    , fields:
        {
            id : {type : GraphQLID},
            title : {type : GraphQLString},
            description : {type : GraphQLString},
            userId : { type : GraphQLID},
        }
})