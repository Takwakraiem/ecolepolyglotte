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
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const userStats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
          active: {
            $sum: {
              $cond: ["$isActive", 1, 0],
            },
          },
        },
      },
    ])

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("firstName lastName email role createdAt")

    return NextResponse.json(
      {
        message: "User statistics fetched successfully",
        userStats,
        recentUsers,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("User statistics error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch user statistics" }, { status: 500 })
  }
}
