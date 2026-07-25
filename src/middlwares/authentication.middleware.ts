import {BadRequestException} from "../common";
import {JwtPayload, verify} from "jsonwebtoken"
export const isAuthGQL = (context : any)=> {
    const authorization = context.headers.authorization;
    const token = authorization.split(' ')[1];
    if(!token){throw new BadRequestException("no token")}
    const payload = verify(token,"ajckdlhhlhkhsdhojfg") as JwtPayload ;
    return context.payload = payload;
}