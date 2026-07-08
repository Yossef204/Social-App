import {RedisProvider} from "./redis.service";
import {REDIS_URL} from "../../../config";

export const redisProvider = new RedisProvider({
    url : REDIS_URL
})