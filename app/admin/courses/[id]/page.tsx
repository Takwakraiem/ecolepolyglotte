"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api-client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function CourseDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const response = await api.getCourse(params.id as string)
        setCourse(response.course)
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement")
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [params.id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.deleteCourse(params.id as string)
      router.push("/admin/courses")
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression")
      setDeleting(false)
    }
  }

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

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p>Cours non trouvé</p>
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
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </div>
                  <Badge>{course.level}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Langue</label>
                    <p className="text-lg font-semibold">{course.language}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Formateur</label>
                    <p className="text-lg font-semibold">
                      {course.teacher?.firstName} {course.teacher?.lastName}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date de début</label>
                    <p className="text-lg font-semibold">{new Date(course.startDate).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date de fin</label>
                    <p className="text-lg font-semibold">{new Date(course.endDate).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Statut</label>
                  <div className="mt-2">
                    {course.isActive ? (
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Inactif</Badge>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Link href={`/admin/courses/${course._id}/edit`}>
                    <Button>Modifier</Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Supprimer le cours</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.
                      </AlertDialogDescription>
                      <div className="flex space-x-3">
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600">
                          Supprimer
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>

            {/* Students List */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Étudiants inscrits</CardTitle>
              </CardHeader>
              <CardContent>
                {course.students && course.students.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {course.students.map((student: any) => (
                        <TableRow key={student._id}>
                          <TableCell>
                            {student.firstName} {student.lastName}
                          </TableCell>
                          <TableCell>{student.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-600">Aucun étudiant inscrit</p>
                )}
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
                  <p className="text-sm text-gray-600">Étudiants inscrits</p>
                  <p className="text-2xl font-bold">
                    {course.students?.length || 0}/{course.maxStudents}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taux de remplissage</p>
                  <p className="text-2xl font-bold">
                    {Math.round(((course.students?.length || 0) / course.maxStudents) * 100)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
