import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Message from "@/models/Message"
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

    // Get unique conversations
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: decoded.userId }, { recipient: decoded.userId }],
        },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", decoded.userId] }, "$recipient", "$sender"],
          },
          lastMessage: { $last: "$content" },
          lastMessageTime: { $last: "$createdAt" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [{ $eq: ["$recipient", decoded.userId] }, { $eq: ["$isRead", false] }],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ])

    // Populate user details
    const populatedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const user = await Message.findOne({
          $or: [
            { sender: conv._id, recipient: decoded.userId },
            { sender: decoded.userId, recipient: conv._id },
          ],
        }).populate(
          {
            path: "sender",
            select: "firstName lastName email avatar",
          },
          {
            path: "recipient",
            select: "firstName lastName email avatar",
          },
        )

        return {
          userId: conv._id,
          lastMessage: conv.lastMessage,
          lastMessageTime: conv.lastMessageTime,
          unreadCount: conv.unreadCount,
          user: user?.sender._id === conv._id ? user.sender : user?.recipient,
        }
      }),
    )

    return NextResponse.json(
      {
        message: "Conversations fetched successfully",
        conversations: populatedConversations,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Fetch conversations error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch conversations" }, { status: 500 })
  }
}
