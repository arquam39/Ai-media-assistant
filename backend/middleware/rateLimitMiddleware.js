const rateLimitMiddleware = ({
    windowMs = 15 * 60 * 1000,
    max = 200
} = {}) => {

    // Each call to rateLimitMiddleware(...) gets its OWN Map,
    // so limiters on different routes never share counters.
    const requests = new Map();

    return (req, res, next) => {

        const key = req.ip;

        const now = Date.now();

        const record = requests.get(key);

        if (!record || now - record.start > windowMs) {

            requests.set(key, {
                start: now,
                count: 1
            });

            return next();
        }

        record.count++;

        if (record.count > max) {
            return res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later."
            });
        }

        next();
    };
};

export default rateLimitMiddleware;