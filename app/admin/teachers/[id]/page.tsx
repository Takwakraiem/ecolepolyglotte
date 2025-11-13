"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Trash2 } from "lucide-react"
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

export default function TeacherDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const loadTeacher = async () => {
      try {
        const response = await api.getTeacher(params.id as string)
        setTeacher(response.teacher)
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement")
      } finally {
        setLoading(false)
      }
    }

    loadTeacher()
  }, [params.id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.deleteTeacher(params.id as string)
      router.push("/admin/teachers")
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

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p>Formateur non trouvé</p>
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

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">
                  {teacher.firstName} {teacher.lastName}
                </CardTitle>
                <CardDescription>{teacher.email}</CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Formateur</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg font-semibold flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  {teacher.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Telephone</label>
                <p className="text-lg font-semibold">{teacher.phone || "Non spécifiée"}</p>
              </div>
            </div>

            {teacher.bio && (
              <div>
                <label className="text-sm font-medium text-gray-600">Biographie</label>
                <p className="text-lg mt-1">{teacher.bio}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-600">Date d'inscription</label>
              <p className="text-lg font-semibold">{new Date(teacher.createdAt).toLocaleDateString("fr-FR")}</p>
            </div>

            <div className="flex space-x-3 pt-4">
              <Link href={`/admin/teachers/${teacher._id}/edit`}>
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
                  <AlertDialogTitle>Supprimer le formateur</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer ce formateur ? Cette action est irréversible.
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
      </div>
    </div>
  )
}
