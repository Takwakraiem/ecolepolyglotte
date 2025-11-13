import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Schedule from "@/models/Schedule"
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
    if (!decoded ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    // Get activity for the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const activityData = await Schedule.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    return NextResponse.json(
      {
        message: "Activity statistics fetched successfully",
        activityData,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Activity statistics error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch activity statistics" }, { status: 500 })
  }
}
