"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"

interface StudentAdminCardProps {
  onSelectAdmin: (adminId: string, adminName: string, avatar?: string) => void
  adminId: string
  adminName: string
  adminAvatar?: string
}

export function StudentAdminCard({ onSelectAdmin, adminId, adminName, adminAvatar }: StudentAdminCardProps) {
  return (
    <Card
      onClick={() => onSelectAdmin(adminId, adminName, adminAvatar)}
      className="border-0 shadow-lg hover:shadow-xl cursor-pointer transition-all hover:scale-105"
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={adminAvatar || "/placeholder.svg"} alt={adminName} />
            <AvatarFallback>{adminName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900">{adminName}</h3>
              <Badge className="bg-blue-100 text-blue-700 border-0">Admin</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">Cliquez pour envoyer un message</p>
            <div className="flex items-center text-sm text-green-600">
              <div className="h-2 w-2 bg-green-600 rounded-full mr-2"></div>
              En ligne
            </div>
          </div>
          <MessageSquare className="h-6 w-6 text-blue-500" />
        </div>
      </CardContent>
    </Card>
  )
}
