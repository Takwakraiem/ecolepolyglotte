import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import User from "@/models/User"
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
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const teachers = await User.find({ role: "TEACHER" }).select("-password")

    return NextResponse.json(
      {
        message: "Teachers fetched successfully",
        count: teachers.length,
        teachers,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Fetch teachers error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch teachers" }, { status: 500 })
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

    const { firstName, lastName, email, password, language, bio,phone } = await req.json()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const teacher = new User({
      firstName,
      lastName,
      email,
      password,
      role: "TEACHER",
      language,
      bio,
      phone,
    })

    await teacher.save()
  await logActivity("USER_CREATED", decoded.userId, `Created teacher ${firstName} ${lastName}`, {
      teacherId: teacher._id.toString(),
      email,
      language,
    })
    return NextResponse.json(
      {
        message: "Teacher created successfully",
        teacher: {
          id: teacher._id,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: teacher.email,
          role: teacher.role,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create teacher error:", error)
    return NextResponse.json({ message: error.message || "Failed to create teacher" }, { status: 500 })
  }
}
