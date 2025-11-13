import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
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

    const enrollmentStats = await Course.aggregate([
      {
        $group: {
          _id: "$language",
          totalEnrollments: { $sum: { $size: "$students" } },
          courseCount: { $sum: 1 },
          avgStudentsPerCourse: { $avg: { $size: "$students" } },
        },
      },
      { $sort: { totalEnrollments: -1 } },
    ])

    return NextResponse.json(
      {
        message: "Enrollment statistics fetched successfully",
        enrollmentStats,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Enrollment statistics error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch enrollment statistics" }, { status: 500 })
  }
}
