import {UserType} from "./user.type";
import {getUser} from "./user.service.gql";
import {GraphQLID, GraphQLString} from "graphql/type";

export const UserQuery = {
    user: {
        type: UserType
        , resolve: getUser
    }
}

// export const UserMutation = {
//     addUser:{
//         type:UserType,
//         args:{
//             id:{type : GraphQLID},
//             name:{type : GraphQLString},
//             email:{type : GraphQLString},
//             password:{type : GraphQLString},
//             phoneNumber:{type : GraphQLString}
//         },
//         resolve : addUser
//     }
// }