"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, AlertCircle, BookOpen, Users, MessageSquare, LogIn, ArrowRight } from "lucide-react"
import { api } from "@/lib/api-client"
import Link from "next/link"

interface Activity {
  id: string
  type: "enrollment" | "course_completion" | "schedule_change" | "teacher_absence" | "message" | "login"
  description: string
  timestamp: string
  user: {
    firstName: string
    lastName: string
    email: string
    role: string
  }
}

export function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const response = await api.getActivities(10)
        setActivities(response.activities || [])
      } catch (error) {
        console.error("Failed to load activities:", error)
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "enrollment":
        return <Users className="h-5 w-5 text-blue-500" />
      case "course_completion":
        return <BookOpen className="h-5 w-5 text-green-500" />
      case "teacher_absence":
        return <AlertCircle className="h-5 w-5 text-orange-500" />
      case "message":
        return <MessageSquare className="h-5 w-5 text-purple-500" />
      case "login":
        return <LogIn className="h-5 w-5 text-gray-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case "enrollment":
        return "bg-blue-100 text-blue-800"
      case "course_completion":
        return "bg-green-100 text-green-800"
      case "teacher_absence":
        return "bg-orange-100 text-orange-800"
      case "message":
        return "bg-purple-100 text-purple-800"
      case "login":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActivityLabel = (type: string) => {
    switch (type) {
      case "enrollment":
        return "Inscription"
      case "course_completion":
        return "Cours complété"
      case "teacher_absence":
        return "Absence prof"
      case "message":
        return "Message"
      case "login":
        return "Connexion"
      default:
        return "Activité"
    }
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            Activités récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Chargement des activités...</div>
        </CardContent>
      </Card>
    )
  }

return (
  <Card className="border-0 shadow-lg">
    <CardHeader>
      <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-blue-500 animate-pulse" />
        Activités récentes
      </CardTitle>
      <CardDescription>Dernières actions sur la plateforme</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Aucune activité pour le moment</div>
        ) : (
          activities.slice(0, 5).map((activity: any) => (
            <div
              key={activity._id}
              className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-gray-200">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{activity.description}</p>
                  <Badge className={`text-xs ${getActivityBadgeColor(activity.type)}`}>
                    {getActivityLabel(activity.type)}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">
                  {activity.user.firstName} {activity.user.lastName} •{" "}
                  {new Date(activity.createdAt).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lien interactif */}
      <Link
        href="/admin/activities"
        className="mt-4 inline-flex items-center justify-center w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        Voir toutes les activités
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </CardContent>
  </Card>
)
}
