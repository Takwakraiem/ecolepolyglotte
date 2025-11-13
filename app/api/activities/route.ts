import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Activity from "@/models/Activity"
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

    const { searchParams } = new URL(req.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const type = searchParams.get("type")

    const query: any = {}
    if (type) {
      query.type = type
    }

    const activities = await Activity.find(query)
      .populate("user", "firstName lastName email role")
      .sort({ createdAt: -1 })
      .limit(limit)

    const totalCount = await Activity.countDocuments(query)

    return NextResponse.json(
      {
        message: "Activities fetched successfully",
        count: activities.length,
        totalCount,
        activities,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Fetch activities error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch activities" }, { status: 500 })
  }
}
