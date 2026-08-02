import {User} from "../../../DB/models/user/user.model";

export const getUser = () => {
    return {id: "123", name: "yossef", email: "y@g.com"}
}
//
// export const addUser = (parent : any , args : any)=> {
//     return await User.create(args)
// }