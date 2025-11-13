"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, Star, ArrowLeft, RefreshCcw } from "lucide-react"
import { api } from "@/lib/api-client"

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await api.getCoursebyuser()
        setCourses(response.courses || [])
      } catch (err) {
        console.error("Failed to load courses:", err)
        setError("Impossible de charger vos cours.")
      } finally {
        setLoading(false)
      }
    }
    loadCourses()
  }, [])

  // --- Fonction pour formater la date ---
  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "—"
    return date.toISOString().split("T")[0] // ✅ format yyyy-mm-dd
  }

  // --- ÉTAT DE CHARGEMENT ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-700">
        <div className="animate-spin text-blue-600 mb-3">
          <RefreshCcw size={28} />
        </div>
        <p>Chargement de vos cours...</p>
      </div>
    )
  }

  // --- ÉTAT D’ERREUR ---
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <Button variant="outline" onClick={() => location.reload()}>
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
                <span className="ml-2 text-xl font-bold text-gray-900">Polyglotte formation</span>
              </Link>
              <Badge variant="secondary" className="ml-3">
                Étudiant
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENU */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bouton Retour */}
        <Link
          href="/student/dashboard"
          className="inline-flex items-center px-4 py-2 mb-6 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes cours</h1>
          <p className="text-gray-600">Accédez à vos formations et ressources pédagogiques</p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Vous n’êtes inscrit à aucun cours pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course._id}
                className="border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
              >
                {/* Bande colorée en haut */}
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-600">{course.language}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">{course.level}</Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-500" />
                      {course.students?.length || 0} étudiants
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      {formatDate(course.startDate)} – {formatDate(course.endDate)}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-blue-500" />
                      {course.rating || "0"} / 5 ({course.totalReviews || 0})
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/student/courses/resources/${course._id}`}>
                      Accéder aux ressources
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
