import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes
} from "@/routes";

export function middleware(req: NextRequest) {
    const { nextUrl } = req;
    
    // Check for session token (NextAuth uses different cookie names based on env)
    const sessionToken = req.cookies.get('authjs.session-token')?.value || 
                        req.cookies.get('__Secure-authjs.session-token')?.value;
    
    const isLoggedIn = !!sessionToken;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    const isApiRoute = nextUrl.pathname.startsWith('/api') && 
        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(req.method);

    // Always allow API auth routes
    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    // Redirect logged-in users away from auth pages
    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return NextResponse.next();
    }

    // Allow public routes and API routes
    if (isPublicRoute || isApiRoute) {
        return NextResponse.next();
    }
    
    // Redirect non-authenticated users to login
    if (!isLoggedIn) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);
        return NextResponse.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}
