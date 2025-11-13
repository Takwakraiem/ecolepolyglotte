"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Download, BookOpen, ArrowLeft, MessageSquare, Crown } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { StudentsTable } from "@/components/admin/students-table"

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.getStudents()
      setStudents(response.students || [])
    } catch (err: any) {
      setError(err.message || "Failed to load students")
      console.error("Failed to load students:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleStudentDeleted = (id: string) => {
    setStudents((prev) => prev.filter((s) => s._id !== id))
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = filterLevel === "all" || student.currentLevel === filterLevel
    const matchesStatus = filterStatus === "all" || (student.isActive ? "active" : "inactive") === filterStatus

    return matchesSearch && matchesLevel && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des étudiants...</p>
        </div>
      </div>
    )
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Gestion des étudiants</h1>
            <p className="text-gray-600">Gérez les inscriptions et le suivi des étudiants</p>
          </div>
          <div className="flex space-x-3">
            {/* <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button> */}
            <Link href="/admin/students/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvel étudiant
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-800">{error}</p>
              <Button onClick={loadStudents} variant="outline" className="mt-2 bg-transparent">
                Réessayer
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
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
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des étudiants ({filteredStudents.length})</CardTitle>
            <CardDescription>Gérez les informations et le suivi de vos étudiants</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun étudiant trouvé</p>
              </div>
            ) : (
              <StudentsTable students={filteredStudents} onStudentDeleted={handleStudentDeleted} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
