"use client"

import { useState, useEffect } from "react"
import { ChatWindow } from "@/components/messaging/chat-window"
import { StudentAdminCard } from "@/components/messaging/student-admin-card"
import { apiCall } from "@/lib/api-client"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User } from "lucide-react"
import Link from "next/link"

export default function StudentMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<{
    recipientId: string
    recipientName: string
    recipientAvatar?: string
  } | null>(null)
  const [user, setUser] = useState<any>(null)
  const [admin, setAdmin] = useState<any>(null)

  useEffect(() => {
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

    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("/api/users?role=ADMIN&limit=1", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          if (data.data && data.data.length > 0) {
            console.log(data)
            setAdmin(data.data[0])
          }
        } else {
          console.error("Error fetching admin data:", response.statusText)
        }
      } catch (error) {
        console.error("Error fetching admin:", error)
      }
    }

    fetchUserData()
    fetchAdmin()
  }, [])

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-20">
      <div className="flex items-center">
        <Link href="/student/dashboard" className="flex items-center">
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <img
              src="/logo.png" // <-- Place your image in /public/logo.png
              alt="Logo EcoleLangues"
              style={{ width: '50px',height:'50px' }}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="ml-3 text-2xl font-bold text-gray-900">Polyglotte formation</span>
        </Link>
        <Badge className="ml-4 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 flex items-center">
          <User className="h-3 w-3 mr-1" />
          Étudiant
        </Badge>
      </div>
   <div className="flex items-center space-x-4">
                 <Link href="/student/dashboard" className="inline-flex items-center px-4 py-2 mb-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour au dashboard
                </Link>


              </div>
    </div>
  </div>
</header>
      <div className="max-w-6xl mx-auto mt-5">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Messages</h1>

        {selectedConversation ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Back to Admin Card */}
            <div className="lg:col-span-1">
              {admin && (
                <StudentAdminCard
                  adminId={admin._id}
                  adminName={`${admin.firstName} ${admin.lastName}`}
                  adminAvatar={admin.avatar}
                  onSelectAdmin={(id, name, avatar) => {
                    setSelectedConversation({ recipientId: id, recipientName: name, recipientAvatar: avatar })
                  }}
                />
              )}
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-2">
              {user && selectedConversation && (
                <ChatWindow
                  userId={user?.id}
                  recipientId={selectedConversation.recipientId}
                  recipientName={selectedConversation.recipientName}
                  recipientAvatar={selectedConversation.recipientAvatar}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contactez l'administration</h2>
            {admin && (
              <StudentAdminCard
                adminId={admin._id}
                adminName={`${admin.firstName} ${admin.lastName}`}
                adminAvatar={admin.avatar}
                onSelectAdmin={(id, name, avatar) => {
                  setSelectedConversation({ recipientId: id, recipientName: name, recipientAvatar: avatar })
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
