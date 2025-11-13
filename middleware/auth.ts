import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"

export function withAuth(handler: Function) {
  return async (req: NextRequest) => {
    const token =
 req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
    ;(req as any).user = decoded
    return handler(req)
  }
}

export function withRole(...roles: string[]) {
  return (handler: Function) => {
    return async (req: NextRequest) => {
      const token =
 req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")

      if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      }

      const decoded = verifyToken(token)
      if (!decoded || !roles.includes(decoded.role)) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 })
      }
      ;(req as any).user = decoded
      return handler(req)
    }
  }
}
