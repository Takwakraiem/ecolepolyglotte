import { createServer } from "http";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { verifyToken } from "./lib/jwt";
import cookie from "cookie";
import * as dotenv from "dotenv";
import Message from "./models/Message";
import {dbConnect} from "./lib/db";

dotenv.config();

declare global {
  var io: SocketIOServer | undefined;
}

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = Number(process.env.PORT || 3000);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Store active users and their socket IDs
const activeUsers = new Map<string, string>();
const userTyping = new Map<string, boolean>();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      console.error("Error handling request:", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  const io = new SocketIOServer(server, {
    cors: {
      origin: dev ? "http://localhost:3000" : false,
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io/",
  });

  // Auth middleware using cookie
  io.use((socket, next) => {
    try {

      const rawCookie = socket.handshake.headers.cookie;
      if (!rawCookie) return next(new Error("No cookie provided"));

      const parsed = cookie.parse(rawCookie);
      const token = parsed["auth-token"];
      console.log(token);
      if (!token) return next(new Error("Authentication error: No token"));

      const user = verifyToken(token);
      console.log(user);

      if (!user) return next(new Error("Authentication error: Invalid token"));

      socket.data.userId = user.userId;
      socket.data.role = user.role;
      next();
    } catch (err) {
      console.error("[v0] Socket auth error:", err);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    console.log(`[v0] User connected: ${userId} (${socket.id})`);

    activeUsers.set(userId, socket.id);
    socket.join(`user:${userId}`);

    io.emit("user_online", { userId, status: "online", timestamp: new Date() });

    // SEND MESSAGE
    socket.on("send_message", async (data: { recipientId: string; content: string }, callback?) => {
      try {
          await dbConnect;
        const newMessage = new Message({
          sender: userId,
          recipient: data.recipientId,
          content: data.content,
          isRead: false,
        });

        await newMessage.save();
        await newMessage.populate("sender", "firstName lastName email avatar");
        await newMessage.populate("recipient", "firstName lastName email avatar");

        const messageData = {
          _id: newMessage._id.toString(),
          sender: {
            _id: newMessage.sender._id.toString(),
            firstName: newMessage.sender.firstName,
            lastName: newMessage.sender.lastName,
            email: newMessage.sender.email,
          },
          recipient: {
            _id: newMessage.recipient._id.toString(),
            firstName: newMessage.recipient.firstName,
            lastName: newMessage.recipient.lastName,
            email: newMessage.recipient.email,
          },
          content: newMessage.content,
          isRead: newMessage.isRead,
          createdAt: newMessage.createdAt,
        };

        io.to(`user:${data.recipientId}`).emit("receive_message", messageData);
        callback?.({ success: true, messageId: newMessage._id, message: messageData });

        console.log(`[v0] Message sent from ${userId} to ${data.recipientId}`);
      } catch (err: any) {
        console.error("[v0] Error sending message:", err);
        callback?.({ error: err.message || "Failed to send message" });
      }
    });

    // MARK READ
    socket.on("mark_read", async (data: { messageId: string }) => {
      try {
        const message = await Message.findByIdAndUpdate(
          data.messageId,
          { isRead: true, readAt: new Date() },
          { new: true }
        );

        if (message) {
          io.to(`user:${message.sender}`).emit("message_read", {
            messageId: data.messageId,
            readAt: new Date(),
          });
          console.log(`[v0] Message ${data.messageId} marked as read`);
        }
      } catch (err) {
        console.error("[v0] Error marking message as read:", err);
      }
    });

    // USER TYPING
    socket.on("user_typing", (data: { recipientId: string; isTyping: boolean }) => {
      userTyping.set(userId, data.isTyping);
      io.to(`user:${data.recipientId}`).emit("user_typing", {
        userId,
        isTyping: data.isTyping,
        timestamp: new Date(),
      });
    });

    // SET PRESENCE
    socket.on("set_presence", (data: { status: "online" | "away" | "offline" }) => {
      io.emit("user_presence", { userId, status: data.status, timestamp: new Date() });
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      activeUsers.delete(userId);
      userTyping.delete(userId);
      console.log(`[v0] User disconnected: ${userId}`);
      io.emit("user_offline", { userId, status: "offline", timestamp: new Date() });
    });

    socket.on("error", (err) => console.error(`[v0] Socket error for user ${userId}:`, err));
  });

  global.io = io;

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log("> Socket.IO server running on same port");
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("[v0] SIGTERM received, shutting down gracefully");
  process.exit(0);
});
