//establish connection
import {ExtendedError, Server, Socket} from 'socket.io';
import {Server as HttpServer} from 'node:http'
import {verify} from "jsonwebtoken";
import {ICacheProvider} from "../cache/cache.interface";
import {redisProvider} from "../cache/redis/init";

export class RealtimeGateway {
    private _io: Server;
    private readonly cacheProvider : ICacheProvider
    constructor(server: HttpServer) {
        this.cacheProvider = redisProvider
        this._io = new Server(server, {cors: {origin: "*"}})
    }

    public establishConnection() {
        this._io.use((socket: Socket, next) => {
            try {
                socket.data = verify(
                    socket.handshake.auth.token,
                    "yossefmoooooooooooo"
                );

                next();
            } catch (err) {
                next(err as ExtendedError);
            }
        });
    }

    public get io() {
        this._io.on('connection', async (socket: Socket) => {

            console.log("new connection", socket.id);
            //socket.data.sub // loginId
            // add socketId to login user
            await this.cacheProvider.set(`socketIds${socket.data.sub}`,socket.id,1000)
            this._io.on('disconnect', (socket: Socket) => {
                //remove socket id
                console.log("disconnected", socket.id)
            })
        });
        return this._io;
    }
}