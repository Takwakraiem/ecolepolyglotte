"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Phone, Video, MoreVertical, AlertCircle, Loader } from "lucide-react"
import { useMessaging } from "@/hooks/useMessaging"

interface ChatWindowProps {
  userId: string
  recipientId: string
  recipientName: string
  recipientAvatar?: string
}

export function ChatWindow({ userId, recipientId, recipientName, recipientAvatar }: ChatWindowProps) {
  const [messageContent, setMessageContent] = useState("")
  const [isSending, setIsSending] = useState(false)
  const { messages, sendMessage, loadMessages, error, isTyping, typingUsers, setUserTyping, markAsRead } = useMessaging(
    userId,
    recipientId,
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    loadMessages(recipientId)
  }, [recipientId, loadMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    messages.forEach((message: any) => {
      if (message.sender._id === recipientId && !message.isRead) {
        markAsRead(message._id)
      }
    })
  }, [messages, recipientId, markAsRead])

  const handleSendMessage = async () => {
    if (!messageContent.trim() || isSending) return

    setIsSending(true)
    try {
      await sendMessage(messageContent, recipientId)
      setMessageContent("")
      loadMessages(recipientId)
    } finally {
      setIsSending(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageContent(e.target.value)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    if (e.target.value.trim()) {
      setUserTyping(recipientId, true)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setUserTyping(recipientId, false)
    }, 1000)
  }

  return (
    <Card className="h-full flex flex-col border-0 shadow-lg">
      {/* Header */}
      <CardHeader className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={recipientAvatar || "/placeholder.svg"} alt={recipientName} />
              <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{recipientName}</CardTitle>
              <p className="text-sm text-gray-500">
                {typingUsers.has(recipientId) ? (
                  <span className="flex items-center space-x-1">
                    <span>En train d'écrire</span>
                    <span className="flex space-x-1">
                      <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></span>
                      <span
                        className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></span>
                      <span
                        className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                    </span>
                  </span>
                ) : (
                  "En ligne"
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px]">
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {messages.map((message: any) => (
          <div key={message._id} className={`flex ${message.sender._id === userId ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender._id === userId
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70 flex items-center space-x-1">
                <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                {message.sender._id === userId && <span>{message.isRead ? "✓✓" : "✓"}</span>}
              </p>
            </div>
          </div>
        ))}
        {/* Scroll target */}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Écrivez votre message..."
            value={messageContent}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isSending) {
                handleSendMessage()
              }
            }}
            className="flex-1"
            disabled={isSending}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={!messageContent.trim() || isSending}
          >
            {isSending ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  )
}
