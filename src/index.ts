import express, { NextFunction, Request, Response } from 'express'
import HelloWorld from './api/HelloWorld'
import RateLimiting from './midleware/RateLimiter'
import { errorHandler } from './error/ErrorHandler'

const app = express()
const port = 3000

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler.handleError(err, res);
});

app.get('/api', RateLimiting.rateLimiterApi, async (request: Request, response: Response) => {
    response.send(await HelloWorld.index());
});

app.listen(port, () => {
    console.log(`Rate limiting app listening on port ${port}`)
});

