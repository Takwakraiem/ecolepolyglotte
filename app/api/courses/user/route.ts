import { NextRequest, NextResponse } from "next/server"
import Course from "@/models/Course"
import { dbConnect } from "@/lib/db"
import { verifyToken } from "@/lib/jwt"

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect()


    const token =
 req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ message: "Invalid token" }, { status: 401 })

    // Récupère les cours où l'utilisateur est soit teacher soit student
    const courses = await Course.find({
      $or: [{ teacher: decoded.userId }, { students: decoded.userId }],
    })
      .populate("teacher", "firstName lastName email")
      .populate("students", "firstName lastName email")

    return NextResponse.json(
      {
        message: "Courses fetched successfully",
        courses,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Fetch user courses error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch courses" }, { status: 500 })
  }
}
