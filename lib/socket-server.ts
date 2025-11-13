// import type { Server as HTTPServer } from "http"
// import { Server as SocketIOServer, type Socket } from "socket.io"
// import { verifyToken } from "./jwt"
// import Message from "@/models/Message"
// import { dbConnect } from "./db"

// let io: SocketIOServer | null = null

// export function initializeWebSocket(httpServer: HTTPServer) {
//   if (io) return io

//   io = new SocketIOServer(httpServer, {
//     cors: {
//       origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
//       methods: ["GET", "POST"],
//     },
//   })

//   // Middleware for authentication
//   io.use((socket, next) => {
//     const token = socket.handshake.auth.token
//     if (!token) {
//       return next(new Error("Authentication error"))
//     }

//     const decoded = verifyToken(token)
//     if (!decoded) {
//       return next(new Error("Invalid token"))
//     }

//     socket.data.userId = decoded.userId
//     next()
//   })

//   io.on("connection", (socket: Socket) => {
//     console.log("[v0] User connected:", socket.data.userId, socket.id)

//     // Join user's personal room
//     socket.on("join_user", (data: { userId: string }) => {
//       socket.join(`user_${data.userId}`)
//       console.log("[v0] User joined room:", `user_${data.userId}`)
//     })

//     // Handle sending messages
//     socket.on("send_message", async (message: any, callback) => {
//       try {
//         await dbConnect()

//         // Save message to database
//         const newMessage = new Message({
//           sender: socket.data.userId,
//           recipient: message.recipient,
//           content: message.content,
//         })

//         await newMessage.save()
//         await newMessage.populate("sender", "firstName lastName email")
//         await newMessage.populate("recipient", "firstName lastName email")

//         // Emit to recipient
//         io?.to(`user_${message.recipient}`).emit("receive_message", newMessage)

//         // Acknowledge to sender
//         callback({ success: true, messageId: newMessage._id })
//       } catch (error: any) {
//         console.error("[v0] Error sending message:", error)
//         callback({ error: error.message })
//       }
//     })

//     // Handle marking messages as read
//     socket.on("mark_read", async (data: { messageId: string; userId: string }) => {
//       try {
//         await dbConnect()

//         await Message.findByIdAndUpdate(data.messageId, { isRead: true })

//         // Notify sender
//         io?.emit("message_read", data.messageId)
//       } catch (error) {
//         console.error("[v0] Error marking message as read:", error)
//       }
//     })

//     // Handle typing indicator
//     socket.on("user_typing", (data: { recipientId: string; isTyping: boolean }) => {
//       io?.to(`user_${data.recipientId}`).emit("user_typing", {
//         userId: socket.data.userId,
//         isTyping: data.isTyping,
//       })
//     })

//     socket.on("disconnect", () => {
//       console.log("[v0] User disconnected:", socket.data.userId)
//     })
//   })

//   return io
// }

// export function getWebSocketServer() {
//   return io
// }
