import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import User from "@/models/User"
import { verifyToken } from "@/lib/jwt"
import Course from "@/models/Course"

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

    const student = await User.findById(id).select("-password")
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 })
    }
    const coursesCount = await Course.countDocuments({ students: student._id })
    return NextResponse.json(
      {
        message: "Student fetched successfully",
        student,
        enrolledCourses: coursesCount, // <-- nombre de cours
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Fetch student error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch student" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
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

    const { firstName, lastName, language, currentLevel,phone, isActive } = await req.json()

    const student = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, language, currentLevel, phone,isActive },
      { new: true },
    ).select("-password")

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        message: "Student updated successfully",
        student,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Update student error:", error)
    return NextResponse.json({ message: error.message || "Failed to update student" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const student = await User.findByIdAndDelete(id)
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Student deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Delete student error:", error)
    return NextResponse.json({ message: error.message || "Failed to delete student" }, { status: 500 })
  }
}
