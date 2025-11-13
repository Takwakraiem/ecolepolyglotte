import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Course from "@/models/Course"
import { verifyToken } from "@/lib/jwt"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
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

    const course = await Course.findById(params.id)
    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 })
    }

    if (course.students.includes(decoded.userId as any)) {
      return NextResponse.json({ message: "Already enrolled in this course" }, { status: 400 })
    }

    if (course.students.length >= course.maxStudents) {
      return NextResponse.json({ message: "Course is full" }, { status: 400 })
    }

    course.students.push(decoded.userId as any)
    await course.save()

    return NextResponse.json(
      {
        message: "Enrolled successfully",
        course,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Enroll error:", error)
    return NextResponse.json({ message: error.message || "Failed to enroll" }, { status: 500 })
  }
}
