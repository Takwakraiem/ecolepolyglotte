"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, RefreshCcw } from "lucide-react"

interface Resource {
  _id: string
  title: string
  type: string
  url: string
}

export default function CourseResources() {
  const params = useParams()
  const courseId = params.id as string
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResources = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/ressource/${courseId}`)
      if (!res.ok) throw new Error("Erreur lors du chargement des ressources.")
      const data = await res.json()
      setResources(data.resources || [])
    } catch (err) {
      console.error(err)
      setError("Impossible de charger les ressources.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (courseId) fetchResources()
  }, [courseId])

  // --- ÉTAT DE CHARGEMENT ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <div className="animate-spin text-blue-600 mb-3">
          <RefreshCcw size={28} />
        </div>
        <p className="text-gray-600 font-medium">Chargement des ressources...</p>
      </div>
    )
  }

  // --- ÉTAT D’ERREUR ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-red-600 font-medium mb-3">{error}</p>
        <Button variant="outline" onClick={fetchResources}>
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
            <div className="flex items-center space-x-3">
              <Link href="/student/dashboard" className="flex items-center">
                <BookOpen className="h-7 w-7 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Polyglotte formation</span>
              </Link>
              <Badge variant="secondary" className="text-sm">Étudiant</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENU */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Bouton Retour */}
        <Link href="/student/courses" className="inline-flex items-center px-4 py-2 mb-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au cours
        </Link>
        {resources.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Aucune ressource disponible pour ce cours.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
              <Card
                key={res._id}
                className="border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                    {res.title}
                  </CardTitle>
                  <CardDescription className="capitalize text-gray-500">{res.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full" variant="outline">
                    <a href={res.url} target="_blank" rel="noopener noreferrer">
                      Ouvrir la ressource
                    </a>
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
