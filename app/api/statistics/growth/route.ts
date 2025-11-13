import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import User from "@/models/User"
import Course from "@/models/Course"
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

    // Get growth data for the last 12 months
    const growthData = await User.aggregate([
      {
        $match: { role: "STUDENT" },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ])

    const courseGrowth = await Course.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ])

    return NextResponse.json(
      {
        message: "Growth statistics fetched successfully",
        studentGrowth: growthData,
        courseGrowth,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Growth statistics error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch growth statistics" }, { status: 500 })
  }
}
