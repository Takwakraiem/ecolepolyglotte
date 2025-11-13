import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Schedule from "@/models/Schedule"
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
    if (!decoded || decoded.role != "STUDENT") {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // Find all courses the student is enrolled in
    const enrolledCourses = await Course.find({
      students: decoded.userId.toString(),
    }).select("_id")

    const courseIds = enrolledCourses.map((course) => course._id)

    // Find schedules for those courses
    const schedules = await Schedule.find({
      course: { $in: courseIds },
      isActive: true,
    })
            .populate({ path: "course", select: "title language level", populate: { path: "teacher", select: "firstName lastName email" } })

      .sort({ date: 1 })

    return NextResponse.json(
      {
        message: "Student schedules fetched successfully",
        count: schedules.length,
        schedules,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Fetch student schedules error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch schedules" }, { status: 500 })
  }
}
