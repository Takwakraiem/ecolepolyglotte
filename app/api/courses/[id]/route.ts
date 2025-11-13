import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Course from "@/models/Course"
import { verifyToken } from "@/lib/jwt"
import User from "@/models/User"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
  const { id } = await params
    const token =
 req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const course = await Course.findById(id)
      .populate("teacher", "firstName lastName email")
      .populate("students", "firstName lastName email")

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        message: "Course fetched successfully",
        course,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Fetch course error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch course" }, { status: 500 })
  }
}



export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params

    const token =
 req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const {
      title,
      description,
      language,
      level,
      teacher,
      maxStudents,
      startDate,
      endDate,
      schedule,
      isActive,
    } = await req.json()

    // Vérifier que le teacher existe et a le rôle correct
    let teacherId = undefined
    if (teacher) {
      const teacherUser = await User.findById(teacher)
      if (!teacherUser || teacherUser.role !== "TEACHER") {
        return NextResponse.json({ message: "Invalid teacher" }, { status: 400 })
      }
      teacherId = teacherUser._id
    }

    const course = await Course.findByIdAndUpdate(
      id,
      {
        title,
        description,
        language,
        level,
        teacher: teacherId,
        maxStudents,
        startDate,
        endDate,
        schedule,
        isActive,
      },
      { new: true }
    ).populate("teacher", "firstName lastName email")

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        message: "Course updated successfully",
        course,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Update course error:", error)
    return NextResponse.json(
      { message: error.message || "Failed to update course" },
      { status: 500 }
    )
  }
}


export async function DELETE(req: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params
    const token =
 req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const course = await Course.findByIdAndDelete(id)
    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Delete course error:", error)
    return NextResponse.json({ message: error.message || "Failed to delete course" }, { status: 500 })
  }
}
