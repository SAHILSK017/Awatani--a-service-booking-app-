const globalRateLimitMap = new Map();
const failedAttemptsMap = new Map();

// Periodic cleanup of rateLimitMaps to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  
  // Cleanup global map
  for (const [ip, record] of globalRateLimitMap.entries()) {
    if (now > record.resetTime) {
      globalRateLimitMap.delete(ip);
    }
  }

  // Cleanup login failed attempts map
  for (const [ip, record] of failedAttemptsMap.entries()) {
    if (record.lockoutUntil > 0 && now > record.lockoutUntil) {
      failedAttemptsMap.delete(ip);
    }
  }
}, 10 * 60 * 1000); // Run cleanup every 10 minutes

/**
 * General global in-memory rate limiter to protect overall server endpoints.
 */
const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000;
  const max = options.max || 100;
  const message = options.message || "Too many requests from this IP, please try again later.";

  return (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const now = Date.now();

    // Bypass loopback addresses in development
    if (
      ip === "127.0.0.1" || 
      ip === "::1" || 
      ip === "localhost" || 
      ip.includes("127.0.0.1") || 
      ip.includes("::1")
    ) {
      return next();
    }

    if (!globalRateLimitMap.has(ip)) {
      globalRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const record = globalRateLimitMap.get(ip);
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      globalRateLimitMap.set(ip, record);
      return next();
    }

    record.count++;
    globalRateLimitMap.set(ip, record);

    if (record.count > max) {
      return res.status(429).json({ message });
    }
    next();
  };
};

/**
 * Express Middleware: Inspects if the client IP is currently locked out
 * due to excessive failed login attempts.
 */
const checkLoginRateLimit = (req, res, next) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const now = Date.now();

  // Bypass localhost / local loopback in development
  if (
    ip === "127.0.0.1" || 
    ip === "::1" || 
    ip === "localhost" || 
    ip.includes("127.0.0.1") || 
    ip.includes("::1")
  ) {
    return next();
  }

  if (failedAttemptsMap.has(ip)) {
    const record = failedAttemptsMap.get(ip);
    
    // If client is currently in a lockout period
    if (record.lockoutUntil > 0 && now < record.lockoutUntil) {
      const minutesLeft = Math.ceil((record.lockoutUntil - now) / 60000);
      return res.status(429).json({
        message: `Too many failed login attempts. Please try again after ${minutesLeft} minutes.`
      });
    } 
    
    // If the lockout window has naturally expired, reset records
    if (record.lockoutUntil > 0 && now >= record.lockoutUntil) {
      failedAttemptsMap.delete(ip);
    }
  }
  next();
};

/**
 * Increments failed attempts counter for a client IP.
 * Triggers lockout after 5 consecutive failures.
 */
const recordFailedAttempt = (ip) => {
  if (
    ip === "127.0.0.1" || 
    ip === "::1" || 
    ip === "localhost" || 
    ip.includes("127.0.0.1") || 
    ip.includes("::1")
  ) {
    return;
  }

  const now = Date.now();
  const maxAttempts = 5;
  const lockoutDuration = 15 * 60 * 1000; // 15 minutes

  if (!failedAttemptsMap.has(ip)) {
    failedAttemptsMap.set(ip, { count: 1, lockoutUntil: 0 });
    return;
  }

  const record = failedAttemptsMap.get(ip);
  record.count++;

  if (record.count >= maxAttempts) {
    record.lockoutUntil = now + lockoutDuration;
  }

  failedAttemptsMap.set(ip, record);
};

/**
 * Resets failed attempts counter for a client IP on successful login.
 */
const recordSuccessfulLogin = (ip) => {
  failedAttemptsMap.delete(ip);
};

module.exports = {
  rateLimiter,
  checkLoginRateLimit,
  recordFailedAttempt,
  recordSuccessfulLogin
};
