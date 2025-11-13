"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useMessaging } from "@/hooks/useMessaging"

interface ConversationsListProps {
  userId: string
  onSelectConversation: (recipientId: string, recipientName: string, avatar?: string) => void
}

export function ConversationsList({ userId, onSelectConversation }: ConversationsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { conversations, loadConversations } = useMessaging(userId)

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  const filteredConversations = conversations.filter((conv) =>
    conv.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="h-full border-0 shadow-lg flex flex-col">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg mb-4">Messages</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="space-y-2 p-2">
          {filteredConversations.map((conv) => (
            <div
              key={conv.userId}
              onClick={() =>
                onSelectConversation(conv.userId, `${conv.user?.firstName} ${conv.user?.lastName}`, conv.user?.avatar)
              }
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <Avatar>
                <AvatarImage src={conv.user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{conv.user?.firstName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {conv.user?.firstName} {conv.user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unreadCount > 0 && <Badge className="bg-blue-500 text-white">{conv.unreadCount}</Badge>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
