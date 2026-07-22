import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";

const hasRedis = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

export const redis = hasRedis ? Redis.fromEnv() : null;

// Used for slug -> originalUrl caching in Redis
export const LINK_CACHE_PREFIX = "link:";
export const LINK_CACHE_TTL_SECONDS = 60 * 60 * 24; // 24 hours

export interface CachedLink {
  id: string;
  originalUrl: string;
  expiresAt: string | null;
}

// Rate limiters using sliding windows
export const createLinkRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      prefix: "ratelimit:create-link",
    })
  : null;

export const loginRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      prefix: "ratelimit:login",
    })
  : null;

export const signupRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "60 s"),
      prefix: "ratelimit:signup",
    })
  : null;

export const redirectRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "60 s"),
      prefix: "ratelimit:redirect",
    })
  : null;

export const settingsRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      prefix: "ratelimit:settings",
    })
  : null;

/**
 * Safely check a rate limit. If Redis is not configured or fails, it allows the request.
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean; reset?: number }> {
  if (!limiter) {
    return { success: true };
  }
  try {
    return await limiter.limit(identifier);
  } catch (error) {
    console.warn("[RateLimit] Redis check failed, allowing request:", error);
    return { success: true };
  }
}

/**
 * Get client IP address inside Next.js Server Actions.
 * NOTE: Trusting x-forwarded-for / x-real-ip headers is safe on Vercel because Vercel's Edge
 * network automatically strips user-supplied spoofed headers and injects verified client IPs.
 * If deploying outside Vercel, ensure your reverse proxy / load balancer handles header sanitization.
 */
export async function getClientIp(): Promise<string> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }
    const realIp = h.get("x-real-ip");
    if (realIp) {
      return realIp.trim();
    }
  } catch {
    // If called outside request context
  }
  return "127.0.0.1";
}
