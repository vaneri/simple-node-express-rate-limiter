
import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from "rate-limit-redis";
import RedisClientWrapper from '../redis/RedisClient';

class RateLimiting {
    private static TIME_TO_LIVE = 200000;
    private static MAX_NUMBER_REQUEST = 100;

    private static rateLimitedMessage = async (request: Request, response: Response) => {
        return `You have exceeded the ${this.MAX_NUMBER_REQUEST} requests in ${this.TIME_TO_LIVE} ms limit!`;
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

    static rateLimiter = () => rateLimit({
        windowMs: this.TIME_TO_LIVE, // milliseconds
        max: this.MAX_NUMBER_REQUEST, // maximum request accepted
        message: this.rateLimitedMessage,
        standardHeaders: true,
        legacyHeaders: false,
        skipFailedRequests: true,
        keyGenerator: this.customGenerator,
        skip: this.skip,
        store: new RedisStore({
            sendCommand: (...args: string[]) => RedisClientWrapper.client.sendCommand(args),
        }),
    });

}
export default RateLimiting;