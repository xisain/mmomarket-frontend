import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  console.log(`[Proxy] ${request.method} ${request.nextUrl.pathname}`);
  
  // Seller Application
  const pathname = request.nextUrl.pathname;
  const isApplicationRoute =
    pathname.startsWith("/seller/applications") ||
    pathname.startsWith("/seller/applications/");
  if (isApplicationRoute && !request.cookies.has("mmo_session")) {
    console.log('user is Not Authenticated');
    return NextResponse.redirect(new URL('/login', request.url))
  }
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Option", "nosniff");

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
