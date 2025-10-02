import { type NextRequest, NextResponse } from 'next/server';
import type { ProxyConfig, ProxyContext, ProxyHandler } from './proxyTypes';

/** URL 안전 결합 (중복 슬래시 제거) */
function joinUrl(base: string, path: string, search: string): string {
  const trimmedBase = base.replace(/\/+$/, '');
  const trimmedPath = path.replace(/^\/+/, '');
  return `${trimmedBase}/${trimmedPath}${search}`;
}

/** 요청 헤더 복제 + 정리 */
function buildUpstreamHeaders(
    req: NextRequest,
    backendHost: string,
    config: ProxyConfig,
): Headers {
  const headers = new Headers(req.headers);

  // 일부 런타임/서버에서 필요한 Host 교체
  headers.set('host', backendHost);

  // 불필요한 헤더 제거
  const strip = new Set((config.stripRequestHeaders ?? []).map((h) => h.toLowerCase()));
  for (const [k] of headers) {
    if (strip.has(k.toLowerCase())) headers.delete(k);
  }

  // 쿠키 → Authorization 승격
  const promote = config.promoteCookieToAuth;
  if (promote) {
    const already = headers.has('authorization');
    const shouldOverwrite = promote.overwriteIfExists === true;
    if (!already || shouldOverwrite) {
      const tok = req.cookies.get(promote.cookieName)?.value;
      if (tok && tok.length > 0) {
        headers.set('authorization', `Bearer ${tok}`);
      }
    }
  }

  // content-length는 런타임에서 재계산되므로 제거
  headers.delete('content-length');

  return headers;
}

/** 중앙 프록시 팩토리 */
export function createProxy(config: ProxyConfig): ProxyHandler {
  const backendUrl = new URL(config.backendBaseUrl);
  const backendHost = backendUrl.host;

  return async (req: NextRequest, ctx: ProxyContext): Promise<Response> => {
    const { path: segs } = await ctx.params;
    const path = Array.isArray(segs) ? segs.join('/') : '';
    const target = joinUrl(config.backendBaseUrl, path, new URL(req.url).search);

    const upstreamHeaders = buildUpstreamHeaders(req, backendHost, config);

    const upstream = await fetch(target, {
      method: req.method,
      headers: upstreamHeaders,
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req.body,
      // 주의: 캐시는 페이지/RSC 레이어에서 제어. 여기선 그대로 전달.
    });

    // 응답을 그대로 브리지(Set-Cookie 포함)
    const res = new NextResponse(upstream.body, { status: upstream.status });
    upstream.headers.forEach((value, key) => {
      res.headers.set(key, value);
    });

    return res;
  };
}
