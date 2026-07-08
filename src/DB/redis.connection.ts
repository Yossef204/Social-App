import { createClient } from "redis";
import { REDIS_URL } from "../config/dev.config";

export const redisClient = createClient({
  url: REDIS_URL,
});
export function connectRedis() {
  redisClient
    .connect()
    .then(() => {
      console.log("Connected to Redis");
    })
    .catch((err) => {
      console.error("Error connecting to Redis");
    });
}
