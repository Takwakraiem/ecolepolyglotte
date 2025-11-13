"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, MessageSquare, Award, CheckCircle, Star, Clock, User, FileText, Zap } from "lucide-react"

interface Activity {
  _id: string
  type: string
  description: string
  timestamp: Date
  user?: {
    firstName: string
    lastName: string
  }
  metadata?: any
}

interface ActivityFeedProps {
  userId?: string
  isAdmin?: boolean
  limit?: number
}

const activityIcons: Record<string, any> = {
  lesson: BookOpen,
  quiz: Award,
  assignment: FileText,
  certificate: Star,
  enrollment: User,
  message: MessageSquare,
  review: Star,
  completion: CheckCircle,
}

const activityColors: Record<string, string> = {
  lesson: "from-blue-500 to-blue-600",
  quiz: "from-purple-500 to-purple-600",
  assignment: "from-orange-500 to-orange-600",
  certificate: "from-yellow-500 to-yellow-600",
  enrollment: "from-green-500 to-green-600",
  message: "from-pink-500 to-pink-600",
  review: "from-red-500 to-red-600",
  completion: "from-teal-500 to-teal-600",
}

export function ActivityFeed({ userId, isAdmin = false, limit = 10 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
    const interval = setInterval(fetchActivities, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [userId, isAdmin])

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token")
      const endpoint = isAdmin ? "/api/statistics/activity" : `/api/statistics/activity?userId=${userId}`

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities || data.recentActivities || [])
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "À l'instant"
    if (minutes < 60) return `Il y a ${minutes}m`
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days}j`
    return new Date(date).toLocaleDateString("fr-FR")
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center text-gray-500">Chargement des activités...</CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-500" />
          Activités récentes
        </CardTitle>
        <CardDescription>Dernières actions sur la plateforme</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Aucune activité pour le moment</div>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, limit).map((activity) => {
              const IconComponent = activityIcons[activity.type] || Clock
              const colorClass = activityColors[activity.type] || "from-gray-500 to-gray-600"

              return (
                <div
                  key={activity._id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClass} flex-shrink-0`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{activity.description}</p>
                    {activity.user && (
                      <p className="text-xs text-gray-600 mt-1">
                        {activity.user.firstName} {activity.user.lastName}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</p>
                  </div>

                  <Badge className="bg-blue-100 text-blue-700 border-0 text-xs flex-shrink-0">{activity.type}</Badge>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
