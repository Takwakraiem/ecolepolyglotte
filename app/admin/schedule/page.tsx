"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, Calendar, Trash2, MoreHorizontal, Edit2, ArrowLeft, AlertCircle, MessageSquare, Crown } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Course {
  _id: string
  title: string
  language: string
  level: string
  teacher?: {
    firstName: string
    lastName: string
  }
}

interface ScheduleItem {
  _id: string
  course: Course
  startTime: string
  endTime: string
  date: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
    const [absenceLoading, setAbsenceLoading] = useState<string | null>(null)

  useEffect(() => {
    loadSchedule()
  }, [])

  const loadSchedule = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.getSchedules()
      setSchedule(response.schedules || [])
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await api.deleteSchedule(id)
      setSchedule((prev) => prev.filter((s) => s._id !== id))
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression")
    } finally {
      setDeletingId(null)
    }
  }

  // Filtrage : si selectedDate vide, afficher tout
  const filteredSchedule = selectedDate
    ? schedule.filter((s) => s.date?.split("T")[0] === selectedDate)
    : schedule

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Chargement du planning...</p>
      </div>
    </div>
  )

 const handleTeacherAbsence = async (scheduleId: string) => {
    setAbsenceLoading(scheduleId)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/schedule/${scheduleId}/teacher-absence`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
       credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors du marquage de l'absence")
      }

      const data = await response.json()
      setSchedule((prev) => prev.filter((s) => s._id !== scheduleId))
      alert(`✅ Absence enregistrée. ${data.affectedStudents} étudiant(s) ont été notifiés par email.`)
    } catch (err: any) {
      setError(err.message || "Erreur lors du marquage de l'absence")
      alert(`❌ ${err.message}`)
    } finally {
      setAbsenceLoading(null)
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

        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion du planning</h1>
            <p className="text-gray-600">Organisez les cours et les horaires</p>
          </div>
          <Link href="/admin/schedule/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un créneau
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">Filtrer par date :</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <Button variant="outline" className="ml-2" onClick={() => setSelectedDate("")}>
            Afficher tout
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-800">{error}</p>
              <Button onClick={loadSchedule} variant="outline" className="mt-2 bg-transparent">
                Réessayer
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              {selectedDate ? `Planning du ${selectedDate}` : "Planning complet"}
            </CardTitle>
            <CardDescription>Vue d'ensemble des cours programmés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Horaire</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Cours</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Prof</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedule.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-gray-500">Aucun créneau à afficher</td>
                    </tr>
                  ) : (
                    filteredSchedule.map((s) => (
                      <tr key={s._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-700">
                          {new Date(s.date).toLocaleDateString("fr-FR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-700">{s.startTime} - {s.endTime}</td>
                        <td className="py-3 px-4">{s.course.title} ({s.course.level})</td>
                        <td className="py-3 px-4">{s.course.teacher?.firstName} {s.course.teacher?.lastName}</td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/admin/schedule/${s._id}/edit`}
                                  className="flex items-center"
                                >
                                  <Edit2 className="mr-2 h-4 w-4" />
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                               <DropdownMenuItem asChild>
                                      <button
                                        className="w-full text-left text-orange-600 flex items-center"
                                        onClick={() => handleTeacherAbsence(s._id)}
                                        disabled={absenceLoading === s._id}
                                      >
                                        <AlertCircle className="mr-2 h-4 w-4" />
                                        {absenceLoading === s._id ? "Traitement..." : "Professeur absent"}
                                      </button>
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
                                    <AlertDialogTitle>Supprimer le créneau</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Êtes-vous sûr de vouloir supprimer ce créneau ? Cette action est
                                      irréversible.
                                    </AlertDialogDescription>
                                    <div className="flex space-x-3">
                                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(s._id)}
                                        disabled={deletingId === s._id}
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
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
