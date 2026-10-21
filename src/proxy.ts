import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {

  console.log(`[Proxy] ${request.method} ${request.nextUrl.pathname}`)
  const response = NextResponse.next()
  response.headers.set("X-Frame-Options", 'DENY')
  response.headers.set("X-Content-Type-Option", 'nosniff')

  return response;
}

export const config = {
 matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
