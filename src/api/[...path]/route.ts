import { NextRequest } from "next/server";
import { ProxyContext } from "@/api/bff/proxyTypes";
import { createProxy } from "@/api/bff/proxy";

const API_BASE_URL: string = process.env.API_BASE_URL ?? "";

const proxy = createProxy({
  backendBaseUrl: API_BASE_URL,
  promoteCookieToAuth: { cookieName: 'accessToken', overwriteIfExists: false },
  stripRequestHeaders: ['content-length'],
});

export async function GET(req: NextRequest, ctx: ProxyContext): Promise<Response> {
  return proxy(req, ctx);
}

export async function POST(req: NextRequest, ctx: ProxyContext): Promise<Response> {
  return proxy(req, ctx);
}

export async function PUT(req: NextRequest, ctx: ProxyContext): Promise<Response> {
  return proxy(req, ctx);
}

export async function PATCH(req: NextRequest, ctx: ProxyContext): Promise<Response> {
  return proxy(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: ProxyContext): Promise<Response> {
  return proxy(req, ctx);
}

export async function OPTIONS(req: NextRequest, ctx: ProxyContext): Promise<Response> {
  return proxy(req, ctx);
}