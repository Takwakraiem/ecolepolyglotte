import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Course from "@/models/Course"
import { verifyToken } from "@/lib/jwt"
import { logActivity } from "@/lib/activity-logger"

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

    const courses = await Course.find({ isActive: true })
      .populate("teacher", "firstName lastName email")
      .populate("students", "firstName lastName email")

    return NextResponse.json(
      {
        message: "Courses fetched successfully",
        count: courses.length,
        courses,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Fetch courses error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch courses" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
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

    const { title, description, language, level, teacher, maxStudents, startDate, endDate, price } = await req.json()

    const course = new Course({
      title,
      description,
      language,
      level,
      teacher,
      maxStudents,
      startDate,
      endDate,
      price,

    })

    await course.save()
    await course.populate("teacher", "firstName lastName email")
 await logActivity("COURSE_CREATED", decoded.userId, `Created course "${title}" (${language} - ${level})`, {
      courseId: course._id.toString(),
      title,
      language,
      level,
      teacher,
    })
    return NextResponse.json(
      {
        message: "Course created successfully",
        course,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create course error:", error)
    return NextResponse.json({ message: error.message || "Failed to create course" }, { status: 500 })
  }
}
