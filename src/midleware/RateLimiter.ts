import rateLimit from 'express-rate-limit';


class RateLimiting {

    public static rateLimiterApi = rateLimit({
        windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
        max: 100,
        message: 'You have exceeded the 100 requests in 24 hrs limit!',
        standardHeaders: true,
        legacyHeaders: false,
    });

}

export default RateLimiting;