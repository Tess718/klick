import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const redis = Redis.fromEnv();

// Used for slug -> originalUrl caching in the proxy redirect layer
export const LINK_CACHE_PREFIX = "link:";
export const LINK_CACHE_TTL_SECONDS = 60 * 60 * 24; // 24h, refreshed on read

// Used to rate-limit link creation (not the redirect path)
export const createLinkRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  prefix: "ratelimit:create-link",
});
