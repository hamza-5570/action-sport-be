import { NextRequest, NextResponse } from "next/server";

export function handleCors(req: NextRequest) {
  const headers = new Headers();

  // Allow all origins (wildcard)
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Vary", "Origin");

  // Return immediately if it's a preflight request
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers,
    });
  }

  return headers;
}

// Helper to return a JSON response with CORS headers
export function corsJson(
  data: Record<string, unknown> | string, // Accepts JSON objects or plain strings
  status = 200,
  extraHeaders?: HeadersInit
) {
  const headers = new Headers(extraHeaders);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Vary", "Origin");

  const body = typeof data === "string" ? data : JSON.stringify(data);

  return new NextResponse(body, {
    status,
    headers,
  });
}

