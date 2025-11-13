"use client"

import { useEffect, useState, useCallback } from "react"
import { initSocket } from "@/lib/socket"
import type { Socket } from "socket.io-client"

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const sock = initSocket()
    console.log(sock);

    setSocket(sock)

    const handleConnect = () => {
      console.log("[v0] Socket connected")
      setIsConnected(true)
    }

    const handleDisconnect = () => {
      console.log("[v0] Socket disconnected")
      setIsConnected(false)
    }

    sock.on("connect", handleConnect)
    sock.on("disconnect", handleDisconnect)

    return () => {
      sock.off("connect", handleConnect)
      sock.off("disconnect", handleDisconnect)
    }
  }, [])

  const emit = useCallback(
    (event: string, data: any) => {
      if (socket) {
        socket.emit(event, data)
      }
    },
    [socket],
  )

  const on = useCallback(
    (event: string, callback: (data: any) => void) => {
      if (socket) {
        socket.on(event, callback)
      }
    },
    [socket],
  )

  const off = useCallback(
    (event: string, callback?: (data: any) => void) => {
      if (socket) {
        socket.off(event, callback)
      }
    },
    [socket],
  )

  return { socket, isConnected, emit, on, off }
}
