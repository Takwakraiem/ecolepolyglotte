"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api-client"

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
      const response = await api.getSchedulesbyStudent()
      setSchedule(response.schedules || [])
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement")
    } finally {
      setLoading(false)
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


  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/student/dashboard" className="inline-flex items-center px-4 py-2 mb-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au dashboard
        </Link>

        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon emploi</h1>
            <p className="text-gray-600"> les cours et les horaires</p>
          </div>

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
