import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Message from "@/models/Message"
import { verifyToken } from "@/lib/jwt"

export async function POST(req: NextRequest) {
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

    const { recipient, content } = await req.json()

    if (!recipient || !content) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const message = new Message({
      sender: decoded.userId,
      recipient,
      content,
    })

    await message.save()
    await message.populate("sender", "firstName lastName email")
    await message.populate("recipient", "firstName lastName email")

    return NextResponse.json(
      {
        message: "Message sent successfully",
        data: message,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Send message error:", error)
    return NextResponse.json({ message: error.message || "Failed to send message" }, { status: 500 })
  }
}
