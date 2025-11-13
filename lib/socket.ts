import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null

export function initSocket() {
  if (socket) return socket

  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000"
  console.log(WS_URL);

  socket = io(WS_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ["websocket", "polling"],
    path: "/socket.io/",

  })

  socket.on("connect", () => {
    console.log("[v0] Socket connected:", socket?.id)
  })

  socket.on("disconnect", () => {
    console.log("[v0] Socket disconnected")
  })

  socket.on("error", (error) => {
    console.error("[v0] Socket error:", error)
  })

  socket.on("connect_error", (error) => {
    console.error("[v0] Connection error:", error)
  })

  return socket
}

function getCookieToken(): string | null {
  if (typeof document === "undefined") return null
  const cookies = document.cookie.split(";")
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=")
    if (name === "auth-token") {
      return decodeURIComponent(value)
    }
  }
  return null
}

export function getSocket() {
  if (!socket) {
    return initSocket()
  }
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
