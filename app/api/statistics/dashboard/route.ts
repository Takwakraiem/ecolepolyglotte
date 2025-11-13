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
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    if (decoded.role === "STUDENT") {
      const studentCourses = await Course.find({ students: decoded.userId })
      const enrolledCount = studentCourses.length

      return NextResponse.json(
        {
          message: "Student dashboard statistics",
          statistics: {
            enrolledCourses: enrolledCount,
            completedCourses: 0,
            inProgressCourses: enrolledCount,
            totalHours: enrolledCount * 30,
            completedHours: 0,
          },
        },
        { status: 200 },
      )
    }

    if (decoded.role === "ADMIN") {
      const totalStudents = await User.countDocuments({ role: "STUDENT" })
      const totalTeachers = await User.countDocuments({ role: "TEACHER" })
      const totalCourses = await Course.countDocuments()
      const activeCourses = await Course.countDocuments({ isActive: true })

      return NextResponse.json(
        {
          message: "Admin dashboard statistics",
          statistics: {
            totalStudents,
            totalTeachers,
            totalCourses,
            activeCourses,
          },
        },
        { status: 200 },
      )
    }

    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  } catch (error: any) {
    console.error("Dashboard statistics error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch dashboard statistics" }, { status: 500 })
  }
}
