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

    const courseStats = await Course.aggregate([
      {
        $group: {
          _id: "$level",
          count: { $sum: 1 },
          totalStudents: { $sum: { $size: "$students" } },
          avgCapacity: { $avg: "$maxStudents" },
        },
      },
      { $sort: { count: -1 } },
    ])

    const topCourses = await Course.find()
      .populate("teacher", "firstName lastName")
      .sort({ students: -1 })
      .limit(10)
      .select("title language level students teacher")

    return NextResponse.json(
      {
        message: "Course statistics fetched successfully",
        courseStats,
        topCourses: topCourses.map((course) => ({
          id: course._id,
          title: course.title,
          language: course.language,
          level: course.level,
          enrollments: course.students.length,
          teacher: course.teacher,
        })),
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Course statistics error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch course statistics" }, { status: 500 })
  }
}
