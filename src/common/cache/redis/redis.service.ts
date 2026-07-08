import {ICacheProvider} from "../cache.interface";
import {Promise} from "mongoose";
import {createClient, RedisClientType} from "redis";
import {redisClient} from "../../../DB";


interface Config {
    url: string;
}

export class RedisProvider implements ICacheProvider {
    private client: RedisClientType;

    constructor(config: Config) {
        this.client = createClient(config);
        this.client.connect().then(() => {
            console.log("Redis Connected Successfully");
        }).
        catch((err) => {
            console.log(err)
        })
    }

    async delete(key: string): Promise<void> {
        await this.client.del(key);
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async set(key: string, value: string, ttl: number): Promise<void> {
        if(ttl){
            await this.client.set(key, value, {EX:ttl});
        }
        await this.client.set(key,value);
    }

}