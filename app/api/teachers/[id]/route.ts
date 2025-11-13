import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import User from "@/models/User"
import { verifyToken } from "@/lib/jwt"

export async function GET(req: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
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

    const teacher = await User.findById(id).select("-password")
    if (!teacher || teacher.role !== "TEACHER") {
      return NextResponse.json({ message: "Teacher not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        message: "Teacher fetched successfully",
        teacher,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Fetch teacher error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch teacher" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { firstName, lastName, phone } = await req.json()

    const teacher = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, phone },
      { new: true },
    ).select("-password")

    if (!teacher) {
      return NextResponse.json({ message: "Teacher not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        message: "Teacher updated successfully",
        teacher,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Update teacher error:", error)
    return NextResponse.json({ message: error.message || "Failed to update teacher" }, { status: 500 })
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

    const teacher = await User.findByIdAndDelete(id)
    if (!teacher) {
      return NextResponse.json({ message: "Teacher not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Teacher deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Delete teacher error:", error)
    return NextResponse.json({ message: error.message || "Failed to delete teacher" }, { status: 500 })
  }
}
