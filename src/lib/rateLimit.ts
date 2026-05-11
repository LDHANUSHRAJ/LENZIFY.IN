import { NextRequest, NextResponse } from "next/server";

/**
 * Simple in-memory rate limiter for API routes.
 * In production, use Redis-based rate limiting (e.g., @upstash/ratelimit).
 */

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS: Record<string, number> = {
  "/api/checkout": 10,
  "/api/razorpay/verify": 15,
  "/api/razorpay/webhook": 100, // Webhooks get higher limit
  default: 30,
};

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export function rateLimit(request: NextRequest, routeKey?: string): NextResponse | null {
  const ip = getClientIP(request);
  const key = `${ip}:${routeKey || request.nextUrl.pathname}`;
  const now = Date.now();

  const entry = rateLimitMap.get(key);
  const maxRequests = MAX_REQUESTS[routeKey || request.nextUrl.pathname] || MAX_REQUESTS.default;

  if (!entry || now - entry.timestamp > WINDOW_MS) {
    rateLimitMap.set(key, { count: 1, timestamp: now });
    return null; // Allow
  }

  if (entry.count >= maxRequests) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  entry.count++;
  return null; // Allow
}

// Cleanup stale entries periodically (runs every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now - entry.timestamp > WINDOW_MS * 5) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}
