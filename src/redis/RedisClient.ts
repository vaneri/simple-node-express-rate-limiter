import { createClient } from "redis";
import RedisClient from '@redis/client/dist/lib/client';


class RedisClientWrapper {
    public static client: RedisClient<any, any, any>;

    static async initializer() {
        this.client = createClient({
            socket: {
                host: 'localhost',
                port: 6379
            }
        });
        await this.client.connect();
        console.log(`client: ${this.client.isOpen ? 'connected' : 'NOT connected'} `);
        this.client.on('error', err => console.log('Redis Client Error', err));
    };
}

export default RedisClientWrapper;