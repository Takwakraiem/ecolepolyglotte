import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import User from "@/models/User"
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

    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt:user.createdAt,
        language: user.language,
        currentLevel: user.currentLevel,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Profile error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
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

    const { firstName, lastName, phone, bio, language, currentLevel } = await req.json()

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { firstName, lastName, phone, bio, language, currentLevel },
      { new: true },
    )

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          bio: user.bio,
          language: user.language,
          currentLevel: user.currentLevel,
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Update profile error:", error)
    return NextResponse.json({ message: error.message || "Failed to update profile" }, { status: 500 })
  }
}
