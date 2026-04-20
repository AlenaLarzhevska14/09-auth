import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

function applySetCookie(
  response: NextResponse,
  setCookie: string | string[] | undefined
) {
  if (!setCookie) {
    return response;
  }

  const cookieHeaders = Array.isArray(setCookie) ? setCookie : [setCookie];

  for (const cookieHeader of cookieHeaders) {
    response.headers.append("set-cookie", cookieHeader);
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let isAuthenticated = Boolean(accessToken);
  let setCookie: string | string[] | undefined;

  if (!accessToken && refreshToken) {
    try {
      const session = await checkSession();
      const data = session.data;
      const sessionSetCookie = session.headers["set-cookie"];

      setCookie = Array.isArray(sessionSetCookie)
        ? sessionSetCookie
        : sessionSetCookie
        ? String(sessionSetCookie)
        : undefined;

      isAuthenticated = Boolean(
        data &&
          typeof data === "object" &&
          (("success" in data && data.success) || "email" in data)
      );
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated && isPrivateRoute) {
    return applySetCookie(
      NextResponse.redirect(new URL("/sign-in", request.url)),
      setCookie
    );
  }

  if (isAuthenticated && isAuthRoute) {
    return applySetCookie(
      NextResponse.redirect(new URL("/", request.url)),
      setCookie
    );
  }

  return applySetCookie(NextResponse.next(), setCookie);
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
