import { redisClient } from "./redis.connection";

export function setIntoCache(key:string,value:any,options?:any){
    return redisClient.set(key,value,options); 
}

export function getFromCache(key:string){
    return redisClient.get(key);
}

export function deleteFromCache(key:string){
    return redisClient.del(key);
}