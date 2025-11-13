import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Message from "@/models/Message"
import { verifyToken } from "@/lib/jwt"
import { logActivity } from "@/lib/activity-logger"

export async function GET(req: NextRequest, { params }: { params: Promise<{ recipientId: string }> }) {
  try {
    await dbConnect()
const { recipientId } = await params
    const token =
 req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const limit = 50
    const skip = 0

    const messages = await Message.find({
      $or: [
        { sender: decoded.userId.toString(), recipient: recipientId.toString() },
        { sender: recipientId.toString(), recipient: decoded.userId.toString() },
      ],
    })
      .populate("sender", "firstName lastName email avatar")
      .populate("recipient", "firstName lastName email avatar")
      .sort({ createdAt: 1 })
      .limit(limit)
      .skip(skip)

    await Message.updateMany(
      {
        recipient: decoded.userId.toString(),
        sender: recipientId.toString(),
        isRead: false,
      },
      { isRead: true },
    )

    await logActivity("MESSAGE_SENT", decoded.userId.toString(), `Viewed messages with ${recipientId.toString()}`, {
      recipientId: recipientId.toString(),
      messageCount: messages.length,
    })

    return NextResponse.json(
      {
        message: "Messages fetched successfully",
        messages,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Fetch messages error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch messages" }, { status: 500 })
  }
}
