import RedisClient from '@redis/client/dist/lib/client';
import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from "rate-limit-redis";
import { createClient } from "redis"



class RateLimiting {

    public static client: RedisClient<any, any, any>;
    static rateLimiter;

    static async initializer() {
        this.client = createClient({
            socket: {
                host: 'localhost',
                port: 6379
            }
        });
        await this.client.connect();
        console.log(`client: ${this.client.isOpen ? 'connected': 'NOT connected'} `);
        this.client.on('error', err => console.log('Redis Client Error', err));
        this.initatilizeRateLimiter();
    };
    
    private static rateLimitedMessage = async (request:Request, response:Response) => {
        return 'You have exceeded the 100 requests in 24 hrs limit!';
    }

    private static customGenerator = async (request: Request) => {
        // use unique identifier for all the connection / depending on the strategy
        // the user here, is always the same user
        return request.user || 'uniqueId';
    }

    private static skip = async (request: Request) => {
        const allowlist = ['127.0.0.1']
        return allowlist.includes(request.ip);
    }
   
    static initatilizeRateLimiter() {
        this.rateLimiter = rateLimit({
            windowMs: 200000, // milliseconds
            max: 100, // maximum request accepted
            message: this.rateLimitedMessage,
            standardHeaders: true,
            legacyHeaders: false,
            skipFailedRequests: true,
            keyGenerator: this.customGenerator,
            skip: this.skip,
            store: new RedisStore({
                sendCommand: (...args: string[]) => this.client.sendCommand(args),
            }),
        });
    }
}
export default RateLimiting;