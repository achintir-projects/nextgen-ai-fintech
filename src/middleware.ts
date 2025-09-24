import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Check if user is trying to access admin routes
    if (pathname.startsWith("/admin")) {
      // For demo purposes, we'll check if the user has an admin role
      // In a real app, this would be stored in the token
      const isAdmin = token?.role === "ADMIN" || token?.email === "admin@example.com"
      
      if (!isAdmin) {
        // Redirect non-admin users to the main page
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes without authentication
        const publicRoutes = ["/", "/legacy", "/docs", "/auth/signin", "/api/auth"]
        const { pathname } = req.nextUrl
        
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true
        }
        
        // Require authentication for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}