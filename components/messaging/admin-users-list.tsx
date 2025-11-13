"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Users } from "lucide-react"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  role: string
}

interface AdminUsersListProps {
  onSelectUser: (userId: string, userName: string, avatar?: string) => void
}

export function AdminUsersList({ onSelectUser }: AdminUsersListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("/api/users?role=STUDENT", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          setUsers(data.data || [])
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="h-full border-0 shadow-lg flex flex-col">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Étudiants
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un étudiant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Chargement...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Aucun étudiant trouvé</p>
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => onSelectUser(user._id, `${user.firstName} ${user.lastName}`, user.avatar)}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <Avatar>
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Étudiant
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
