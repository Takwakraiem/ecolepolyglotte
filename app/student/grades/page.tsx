"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadGrades()
  }, [])

  const loadGrades = async () => {
    setLoading(true)
    setError(null)
    try {
      // For now, using mock data
      setGrades([
        {
          id: 1,
          course: "Anglais B2",
          assignments: [
            { name: "Devoir 1", grade: 18, maxGrade: 20, date: "2024-01-15" },
            { name: "Devoir 2", grade: 17, maxGrade: 20, date: "2024-01-22" },
            { name: "Quiz", grade: 9, maxGrade: 10, date: "2024-01-29" },
          ],
          average: 17.3,
          status: "Excellent",
        },
        {
          id: 2,
          course: "Espagnol A2",
          assignments: [
            { name: "Devoir 1", grade: 15, maxGrade: 20, date: "2024-01-16" },
            { name: "Participation", grade: 8, maxGrade: 10, date: "2024-01-23" },
          ],
          average: 15.5,
          status: "Bon",
        },
      ])
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement")
      console.error("Failed to load grades:", err)
    } finally {
      setLoading(false)
    }
  }

  const certificates = [
    {
      id: 1,
      name: "Certificat DELF A2",
      date: "2024-01-10",
      level: "A2",
      status: "Obtenu",
    },
    {
      id: 2,
      name: "Certificat DELF B1",
      date: "2024-06-15",
      level: "B1",
      status: "En cours",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent":
        return "bg-green-100 text-green-800"
      case "Bon":
        return "bg-blue-100 text-blue-800"
      case "Moyen":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement de vos notes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Award className="h-8 w-8 mr-3 text-blue-600" />
            Mes notes et certificats
          </h1>
          <p className="text-gray-600">Consultez vos résultats et vos certifications</p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Grades by Course */}
        <div className="space-y-6 mb-8">
          {grades.map((course) => (
            <Card key={course.id} className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold">{course.course}</CardTitle>
                    <CardDescription>Vos résultats et évaluations</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{course.average.toFixed(1)}</div>
                    <Badge className={getStatusColor(course.status)}>{course.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.assignments.map((assignment: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{assignment.name}</p>
                        <p className="text-sm text-gray-600">{new Date(assignment.date).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {assignment.grade}/{assignment.maxGrade}
                          </p>
                          <p className="text-sm text-gray-600">
                            {((assignment.grade / assignment.maxGrade) * 100).toFixed(0)}%
                          </p>
                        </div>
                        <Progress value={(assignment.grade / assignment.maxGrade) * 100} className="w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Certificates */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Mes certificats
            </CardTitle>
            <CardDescription>Vos certifications obtenues et en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                      <p className="text-sm text-gray-600">{new Date(cert.date).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <Badge
                      className={cert.status === "Obtenu" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                    >
                      {cert.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Niveau {cert.level}</span>
                    {cert.status === "Obtenu" && <CheckCircle className="h-5 w-5 text-green-500" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
