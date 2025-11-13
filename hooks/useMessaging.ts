"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useSocket } from "./useSocket"
import { apiCall } from "@/lib/api-client"

export interface Message {
  _id: string
  sender: {
    _id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string | null
  }
  recipient: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  content: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export function useMessaging(userId: string, recipientId?: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const { socket, isConnected, emit, on, off } = useSocket()
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const messageIdsRef = useRef<Set<string>>(new Set())

  // Socket events
  useEffect(() => {
    if (!isConnected || !userId) return

    emit("join_user", { userId })

    const handleReceiveMessage = (message: Message) => {
      if (messageIdsRef.current.has(message._id)) return
      messageIdsRef.current.add(message._id)
      setMessages((prev) => [...prev, message])

      // Auto mark as read if recipient is current user
      if (message.recipient._id === userId) {
        setTimeout(() => {
          emit("mark_read", { messageId: message._id })
        }, 500)
      }
    }

    const handleMessageRead = (data: { messageId: string; readAt: string }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === data.messageId ? { ...msg, isRead: true } : msg))
      )
    }

    const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev)
        if (data.isTyping) newSet.add(data.userId)
        else newSet.delete(data.userId)
        return newSet
      })
    }

    on("receive_message", handleReceiveMessage)
    on("message_read", handleMessageRead)
    on("user_typing", handleUserTyping)

    return () => {
      off("receive_message", handleReceiveMessage)
      off("message_read", handleMessageRead)
      off("user_typing", handleUserTyping)
    }
  }, [isConnected, userId, emit, on, off])

  // Send a message
  const sendMessage = useCallback(
    async (content: string, recipientId: string) => {
      if (!socket || !content.trim()) return
      try {
        setError(null)
        const messagePayload = {
          recipientId,
          content: content.trim(),
        }
        emit("send_message", messagePayload)
        emit("user_typing", { recipientId, isTyping: false })
        setIsTyping(false)
      } catch (err: any) {
        setError(err.message || "Failed to send message")
      }
    },
    [socket, emit]
  )

  // Mark a message as read
  const markAsRead = useCallback(
    (messageId: string) => {
      if (!socket) return
      emit("mark_read", { messageId })
    },
    [socket, emit]
  )

  // Set typing status
  const setUserTyping = useCallback(
    (recipientId: string, typing: boolean) => {
      if (!socket) return
      setIsTyping(typing)
      emit("user_typing", { recipientId, isTyping: typing })
      if (typing) {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => {
          emit("user_typing", { recipientId, isTyping: false })
          setIsTyping(false)
        }, 3000)
      }
    },
    [socket, emit]
  )

  // Load messages from API
  const loadMessages = useCallback(
    async (recipientId: string) => {
      setLoading(true)
      try {
        setError(null)
        const response = await apiCall(`/api/messages/${recipientId}`)
        const loadedMessages: Message[] = response.messages || []
        setMessages(loadedMessages)
        loadedMessages.forEach((msg) => messageIdsRef.current.add(msg._id))
      } catch (err: any) {
        setError(err.message || "Failed to load messages")
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    messages,
    loading,
    error,
    isTyping,
    typingUsers,
    sendMessage,
    markAsRead,
    setUserTyping,
    loadMessages,
  }
}
