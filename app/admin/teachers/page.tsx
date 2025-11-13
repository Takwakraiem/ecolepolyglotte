"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Download, BookOpen, ArrowLeft, MessageSquare, Crown } from "lucide-react"
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

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadTeachers()
  }, [])

  const loadTeachers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.getTeachers()
      setTeachers(response.teachers || [])
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement")
      console.error("Failed to load teachers:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await api.deleteTeacher(id)
      setTeachers((prev) => prev.filter((t) => t._id !== id))
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression")
    } finally {
      setDeletingId(null)
    }
  }

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des formateurs...</p>
        </div>
      </div>
    )
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
          {/* Bouton Retour */}
        <Link href="/admin/dashboard" className="inline-flex items-center px-4 py-2 mb-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au dashboard
        </Link>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des formateurs</h1>
            <p className="text-gray-600">Gérez les enseignants et leurs formations</p>
          </div>
          <div className="flex space-x-3">
            {/* <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button> */}
            <Link href="/admin/teachers/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau formateur
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-800">{error}</p>
              <Button onClick={loadTeachers} variant="outline" className="mt-2 bg-transparent">
                Réessayer
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liste des formateurs ({filteredTeachers.length})</CardTitle>
            <CardDescription>Gérez les informations de vos enseignants</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTeachers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun formateur trouvé</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Formateur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telephone</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.map((teacher) => (
                    <TableRow key={teacher._id}>
                      <TableCell className="font-medium">
                        {teacher.firstName} {teacher.lastName}
                      </TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacher.phone || "Non spécifiée"}</TableCell>
                      <TableCell>
                        {teacher.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Actif</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Inactif</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/teachers/${teacher._id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir le profil
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/teachers/${teacher._id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button className="w-full text-left text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4 inline" />
                                    Supprimer
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogTitle>Supprimer le formateur</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer ce formateur ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                  <div className="flex space-x-3">
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(teacher._id)}
                                      disabled={deletingId === teacher._id}
                                      className="bg-red-600"
                                    >
                                      Supprimer
                                    </AlertDialogAction>
                                  </div>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
