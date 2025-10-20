import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { generatedRoutes } from "./lib/generated-routes";
import { DEFAULT_SIGN_IN_REDIRECT } from "./lib/redirect-config";

const intlMiddleware = createIntlMiddleware(routing);

function testPathnameRegex(
  pages: readonly string[],
  pathName: string,
): boolean {
  const routePatterns = pages.map((page) => {
    if (page.includes(":locale")) {
      const base = page.replace(":locale", "").replace("//", "/");
      return `${base}`;
    }
    return page;
  });

  return RegExp(
    `^(/(${routing.locales.join("|")}))?(${routePatterns
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i",
  ).test(pathName);
}

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthRoute = testPathnameRegex(
    [...generatedRoutes.auth],
    nextUrl.pathname,
  );
  const isProtectedRoute = testPathnameRegex(
    generatedRoutes.protected,
    nextUrl.pathname,
  );

  if (!session && isProtectedRoute) {
    const callbackUrl = `${nextUrl.pathname}${nextUrl.search || ""}`;
    const safeCallback = callbackUrl.startsWith("http") ? "/" : callbackUrl;
    return NextResponse.redirect(
      new URL(
        `/auth/sign-in?callback_url=${encodeURIComponent(safeCallback)}`,
        nextUrl,
      ),
    );
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL(DEFAULT_SIGN_IN_REDIRECT, nextUrl));
  }

  return intlMiddleware(req);
}

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
