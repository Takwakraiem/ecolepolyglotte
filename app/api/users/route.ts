import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import User from "@/models/User"
import { verifyToken } from "@/lib/jwt"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const token =
 req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const role = searchParams.get("role")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const query: any = {}
    if (role) {
      query.role = role
    }

    const users = await User.find(query).limit(limit).select("_id firstName lastName email avatar role")

    return NextResponse.json(
      {
        message: "Users fetched successfully",
        data: users,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Fetch users error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch users" }, { status: 500 })
  }
}
