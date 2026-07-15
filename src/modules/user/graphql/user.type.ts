import {GraphQLID, GraphQLObjectType, GraphQLString} from "graphql/type";

export const UserType = new GraphQLObjectType({
    name: "UserQuery",
    fields: {
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
        phoneNumber: {type: GraphQLString}
    }
})