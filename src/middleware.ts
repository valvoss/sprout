import { NextRequest, NextResponse } from "next/server";

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (not /admin/login or /api/admin/auth)
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/api/admin/auth")
  ) {
    const session = request.cookies.get("admin_session")?.value;
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const expectedToken = await sha256(password);

    if (session !== expectedToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
