import express, { NextFunction, Request, Response } from 'express'
import HelloWorld from './api/HelloWorld'
import RateLimiting from './handlers/RateLimiter'
import { errorHandler } from './error/ErrorHandler'
import SessionHandler from './handlers/SessionHandler'
import RedisClientWrapper from './redis/RedisClient'

const app = express()
const port = 3000

//
// this is extending the Request object globally
declare global {
    namespace Express {
        export interface Request {
            user?: string;
        }
    }
}

RedisClientWrapper.initializer().then(() => {

    app.all('*', SessionHandler.provideSession);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        errorHandler.handleError(err, res);
    });
    
    app.use('/api', RateLimiting.rateLimiter());
    
    app.get('/api', async (request: Request, response: Response) => {
        response.send(await HelloWorld.index());
    });
    
    app.listen(port, () => {
        console.log(`Rate limiting app listening on port ${port}`)
    });

});

