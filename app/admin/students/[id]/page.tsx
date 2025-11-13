"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api-client"

export default function StudentDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [student, setStudent] = useState<any>(null)
  const [nbr, setNbr] = useState<any>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const response = await api.getStudent(params.id as string)
        setStudent(response.student)
        setNbr(response.enrolledCourses)
        console.log(response);

      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement")
      } finally {
        setLoading(false)
      }
    }

    loadStudent()
  }, [params.id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-red-600">{error}</p>
            <Button onClick={() => router.back()} className="mt-4">
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p>Étudiant non trouvé</p>
            <Button onClick={() => router.back()} className="mt-4">
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'étudiant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {student.firstName} {student.lastName}
                    </h2>
                    <p className="text-gray-600">{student.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Langue</label>
                    <p className="text-lg font-semibold">{student.language}</p>
                  </div>
                   <div>
                    <label className="text-sm font-medium text-gray-600">Telephone</label>
                    <p className="text-lg font-semibold">{student.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Niveau actuel</label>
                    <Badge className="mt-1">{student.currentLevel}</Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Statut</label>
                  <div className="mt-2">
                    {student.isActive ? (
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Inactif</Badge>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Link href={`/admin/students/${student._id}/edit`}>
                    <Button>Modifier</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Cours inscrits</p>
                  <p className="text-2xl font-bold">{nbr || 0} </p>
                </div>
               
                <div>
                  <p className="text-sm text-gray-600">Date d'inscription</p>
                  <p className="text-sm font-semibold">{new Date(student.createdAt).toLocaleDateString("fr-FR")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
