"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2, Search, AlertCircle, CheckCircle2, Users } from "lucide-react"
import { api } from "@/lib/api-client"
import { Input } from "@/components/ui/input"

export default function AssignStudentsPage() {
  const router = useRouter()
  const params = useParams()
  const [course, setCourse] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        setError("")
        const [courseRes, studentsRes] = await Promise.all([api.getCourse(params.id as string), api.getStudents()])

        if (!courseRes.course) {
          throw new Error("Cours non trouvé")
        }

        setCourse(courseRes.course)
        setStudents(studentsRes.students || [])

        if (courseRes.course.students && Array.isArray(courseRes.course.students)) {
          const studentIds = courseRes.course.students.map((s: any) => (typeof s === "string" ? s : s._id))
          setSelectedStudents(studentIds)
        }
      } catch (err: any) {
        console.error("[v0] Error loading data:", err)
        setError(err.message || "Erreur lors du chargement des données")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id])

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(filteredStudents.map((s) => s._id))
    }
  }

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      if (!selectedStudents.length) throw new Error("Veuillez sélectionner au moins un étudiant")
      if (course.maxStudents && selectedStudents.length > course.maxStudents)
        throw new Error(`Capacité maximale dépassée (${course.maxStudents})`)

      const res = await fetch(`/api/courses/${params.id as string}/affecter`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: selectedStudents }),
        credentials: "include",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Erreur serveur")
      }

      setSuccess(`${selectedStudents.length} étudiant(s) affecté(s) avec succès !`)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalStudents = students.length
  const selectedCount = selectedStudents.length
  const capacityPercentage = course?.maxStudents ? Math.round((selectedCount / course.maxStudents) * 100) : 0
  const isAtCapacity = course?.maxStudents && selectedCount >= course.maxStudents

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
              <p className="text-red-600 font-medium">Cours non trouvé</p>
              <Button onClick={() => router.back()} className="mt-4">
                Retour
              </Button>
            </div>
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
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Affecter des étudiants
            </CardTitle>
            <CardDescription>
              Sélectionnez les étudiants pour le cours :{" "}
              <span className="font-semibold text-gray-900">{course?.title}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>{success}</div>
                </div>
              )}

              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un étudiant par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {course?.maxStudents && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-900">Capacité du cours</span>
                    <span className="text-sm text-blue-700">
                      {selectedCount} / {course.maxStudents}
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${isAtCapacity ? "bg-red-500" : "bg-blue-600"}`}
                      style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                <Checkbox
                  checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                  onCheckedChange={handleSelectAll}
                  id="select-all"
                />
                <label htmlFor="select-all" className="flex-1 cursor-pointer font-medium text-gray-700">
                  Sélectionner tous ({filteredStudents.length})
                </label>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-3 bg-white">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <div
                      key={student._id}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <Checkbox
                        checked={selectedStudents.includes(student._id)}
                        onCheckedChange={() => handleStudentToggle(student._id)}
                        id={student._id}
                      />
                      <label htmlFor={student._id} className="flex-1 cursor-pointer">
                        <div className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        {student.language} {student.currentLevel}
                        <div className="text-sm text-gray-600">{student.email}</div>
                        {student.level && (
                          <div className="text-xs text-gray-500">
                            Niveau: <span className="font-medium">{student.level}</span>
                          </div>
                        )}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? "Aucun étudiant ne correspond à votre recherche" : "Aucun étudiant disponible"}
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg font-medium">
                {selectedCount} étudiant(s) sélectionné(s) sur {totalStudents}
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                <Button type="submit" disabled={submitting || selectedStudents.length === 0} className="flex-1">
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {submitting ? "Affectation en cours..." : "Affecter les étudiants"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
