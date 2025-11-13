"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Users, Clock, BookOpen, Calendar, ArrowLeft, MessageSquare, Crown } from "lucide-react"
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

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLanguage, setFilterLanguage] = useState("all")
  const [filterLevel, setFilterLevel] = useState("all")
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const response = await api.getCourses()
      setCourses(response.courses || [])
    } catch (error) {
      console.error("Failed to load courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await api.deleteCourse(id)
      setCourses(courses.filter((c) => c._id !== id))
    } catch (error) {
      console.error("Failed to delete course:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">En cours</Badge>
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">À venir</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Terminé</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getLevelBadge = (level: string) => {
    const colors = {
      A1: "bg-yellow-100 text-yellow-800",
      A2: "bg-yellow-100 text-yellow-800",
      B1: "bg-orange-100 text-orange-800",
      B2: "bg-orange-100 text-orange-800",
      C1: "bg-red-100 text-red-800",
      C2: "bg-red-100 text-red-800",
    }
    return <Badge className={colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{level}</Badge>
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacher?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLanguage = filterLanguage === "all" || course.language === filterLanguage
    const matchesLevel = filterLevel === "all" || course.level === filterLevel

    return matchesSearch && matchesLanguage && matchesLevel
  })

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  const totalStudents = courses.reduce((sum, course) => sum + (course.students?.length || 0), 0)
  const activeCourses = courses.filter((c) => c.isActive).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des cours</h1>
            <p className="text-gray-600">Créez et gérez vos formations linguistiques</p>
          </div>
          <Link href="/admin/courses/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau cours
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total cours</p>
                  <p className="text-2xl font-bold">{courses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Étudiants inscrits</p>
                  <p className="text-2xl font-bold">{totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cours actifs</p>
                  <p className="text-2xl font-bold">{activeCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Langues</p>
                  <p className="text-2xl font-bold">{new Set(courses.map((c) => c.language)).size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par titre ou formateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les langues</SelectItem>
                  <SelectItem value="Anglais">Anglais</SelectItem>
                  <SelectItem value="Français">Français</SelectItem>
                  <SelectItem value="Espagnol">Espagnol</SelectItem>
                  <SelectItem value="Allemand">Allemand</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="C1">C1</SelectItem>
                  <SelectItem value="C2">C2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Courses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des cours ({filteredCourses.length})</CardTitle>
            <CardDescription>Gérez vos formations et leurs paramètres</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cours</TableHead>
                  <TableHead>Formateur</TableHead>
                  <TableHead>Étudiants</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{course.title}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-500">{course.language}</span>
                          {getLevelBadge(course.level)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {course.teacher?.firstName} {course.teacher?.lastName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {course.students?.length || 0}/{course.maxStudents}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(course.startDate).toLocaleDateString("fr-FR")}</div>
                        <div className="text-gray-500">à {new Date(course.endDate).toLocaleDateString("fr-FR")}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(course.isActive ? "active" : "inactive")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${course._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${course._id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                           <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/ressource/${course._id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Ajouter ressources
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${course._id}/affecter`}>
                              <Users className="mr-2 h-4 w-4" />
                              Affecter étudiants
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
                                <AlertDialogTitle>Supprimer le cours</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.
                                </AlertDialogDescription>
                                <div className="flex space-x-3">
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(course._id)}
                                    disabled={deletingId === course._id}
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
