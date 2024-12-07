// ... existing code ...
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { NextAuth } from 'next-auth'
// ... existing code ...

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
  }
}