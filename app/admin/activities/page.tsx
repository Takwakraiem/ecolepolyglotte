"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Clock, Crown, Filter, MessageSquare } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>("all")

  useEffect(() => {
    loadActivities()
  }, [selectedType])

  const loadActivities = async () => {
    setLoading(true)
    try {
      const response = await api.getActivities(100, selectedType === "all" ? undefined : selectedType)
      setActivities(response.activities || [])
    } catch (error) {
      console.error("Failed to load activities:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      enrollment: "👥",
      course_completion: "✅",
      teacher_absence: "⚠️",
      message: "💬",
      login: "🔐",
    }
    return icons[type] || "📌"
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

  return (
    <div className="min-h-screen bg-gray-50">
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
        <Link
          href="/admin/messages"
          className="flex items-center  text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
        >
          <MessageSquare className="h-4 w-5 mr-2" />
          Messages
        </Link>


      </div>
    </div>
  </div>
</header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Link href="/admin/dashboard" className="inline-flex items-center px-4 py-2 mb-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Retour au dashboard
                        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Toutes les activités</h1>
          <p className="text-gray-600">Historique complet des actions sur la plateforme</p>
        </div>

        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtrer les activités
                </CardTitle>
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="enrollment">Inscriptions</SelectItem>
                  <SelectItem value="course_completion">Cours complétés</SelectItem>
                  <SelectItem value="teacher_absence">Absences prof</SelectItem>
                  <SelectItem value="message">Messages</SelectItem>
                  <SelectItem value="login">Connexions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Chargement des activités...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune activité trouvée</p>
              </div>
            ) : (
              <div className="divide-y">
                {activities.map((activity) => (
                  <div key={activity._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-semibold text-gray-900">{activity.description}</p>
                            <Badge className={getActivityBadgeColor(activity.type)}>
                              {activity.type.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Par:{" "}
                            <strong>
                              {activity.user.firstName} {activity.user.lastName}
                            </strong>{" "}
                            ({activity.user.role})
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.createdAt).toLocaleString("fr-FR")}
                          </p>
                          {activity.metadata?.affectedStudents && (
                            <p className="text-xs text-orange-600 mt-2">
                              ⚠️ {activity.metadata.affectedStudents} étudiant(s) affecté(s)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
