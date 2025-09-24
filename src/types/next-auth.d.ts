import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      organizationId?: string | null
      organization?: any
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    organizationId?: string | null
    organization?: any
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    organizationId?: string | null
    organization?: any
  }
}