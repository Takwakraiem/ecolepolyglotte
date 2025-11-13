import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import User from "@/models/User"
import { generateToken } from "@/lib/jwt"
import { logActivity } from "@/lib/activity-logger"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const { firstName, lastName, email, password, role = "STUDENT" } = await req.json()

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
    })

    await user.save()

    const token = generateToken(user._id.toString(), user.role,user.email)
 await logActivity("USER_REGISTRATION", user._id.toString(), `${firstName} ${lastName} registered as ${role}`, {
      email,
      role,
    })
    return NextResponse.json(
      {
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: error.message || "Registration failed" }, { status: 500 })
  }
}
