import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import User from "@/models/User"
import Course from "@/models/Course"
import { verifyToken } from "@/lib/jwt"
import Langue from "@/models/Langue"

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

    const totalStudents = await User.countDocuments({ role: "STUDENT" })
    const totalTeachers = await User.countDocuments({ role: "TEACHER" })
    const totalCourses = await Course.countDocuments()
    const totalLangues = await Langue.countDocuments()

    const activeCourses = await Course.countDocuments({ isActive: true })
    const totalEnrollments = await Course.aggregate([
      { $group: { _id: null, total: { $sum: { $size: "$students" } } } },
    ])



    return NextResponse.json(
      {
        message: "Statistics fetched successfully",
        statistics: {
          totalStudents,
          totalTeachers,
          totalCourses,
          activeCourses,
          totalLangues,
          totalEnrollments: totalEnrollments[0]?.total || 0,

        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Fetch statistics error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch statistics" }, { status: 500 })
  }
}
