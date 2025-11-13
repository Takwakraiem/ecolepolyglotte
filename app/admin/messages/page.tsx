"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Clock, Crown, ArrowLeft } from "lucide-react"
import { ChatWindow } from "@/components/messaging/chat-window"
import { AdminUsersList } from "@/components/messaging/admin-users-list"
import Link from "next/link"
import { apiCall } from "@/lib/api-client"

export default function AdminMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<{
    recipientId: string
    recipientName: string
    recipientAvatar?: string
  } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(  () => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        return
      }

      try {
        const profile = await apiCall("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(profile)
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }
    fetchUserData()
  }, [])

  return (
    <div className="min-h-screen ">
          <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo + Nom + Badge */}
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12">
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
                  {/* Logo image */}
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <img
                      src="/logo.png" // <-- mettre ton image dans /public/logo.png
                      alt="Logo EcoleLangues"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Nom de l'école */}
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                 Polyglotte formation
                </span>

                {/* Badge Super Admin */}
                <Badge className="ml-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 flex items-center">
                  <Crown className="h-3 w-3 mr-1" />
                  Super Admin
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                 <Link href="/admin/dashboard" className="inline-flex items-center px-4 py-2 mb-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                                 <ArrowLeft className="w-4 h-4 mr-2" />
                                 Retour au dashboard
                               </Link>


              </div>
            </div>
          </div>
        </header>
      <div className="max-w-7xl mx-auto mt-5">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <MessageSquare className="h-8 w-8 mr-3 text-blue-600" />
            Messagerie Administrative
          </h1>
          <p className="text-xl text-gray-600">Gérez vos conversations avec les étudiants</p>
        </div>

        {/* Main Chat Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
          <div className="lg:col-span-1">
            <AdminUsersList
              onSelectUser={(userId, userName, avatar) => {
                setSelectedConversation({ recipientId: userId, recipientName: userName, recipientAvatar: avatar })
              }}
            />
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <ChatWindow
                userId={user?.id}
                recipientId={selectedConversation.recipientId}
                recipientName={selectedConversation.recipientName}
                recipientAvatar={selectedConversation.recipientAvatar}
              />
            ) : (
              <Card className="h-full border-0 shadow-lg flex items-center justify-center">
                <CardContent className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Sélectionnez un étudiant pour commencer</p>
                  <p className="text-gray-400 text-sm mt-2">Vos messages avec les étudiants apparaîtront ici</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>


      </div>
    </div>
  )
}
