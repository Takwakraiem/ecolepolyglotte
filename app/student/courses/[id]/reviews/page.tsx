"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ReviewForm } from "@/components/reviews/review-form"
import { ReviewsList } from "@/components/reviews/review-list"

export default function CourseReviewsPage() {
  const params = useParams()
  const courseId = params.id as string
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`/api/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setCourse(data.course)
        }
      } catch (error) {
        console.error("Failed to fetch course:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/student/courses">
            <Button variant="outline" className="mb-6 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux cours
            </Button>
          </Link>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Cours non trouvé</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link href="/student/courses">
          <Button variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux cours
          </Button>
        </Link>

        {/* Course Info */}
        <Card className="mb-8 border-0 shadow-lg overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100">
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
            <img
              src="/logo.png" // <-- Place your image in /public/logo.png
              alt="Logo EcoleLangues"
              style={{ width: '50px',height:'50px' }}
              className="w-full h-full object-contain"
            />
          </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                  <p className="text-gray-600 mb-3">{course.description}</p>
                  <div className="flex gap-2">
                    <Badge className="bg-blue-100 text-blue-700 border-0">{course.language}</Badge>
                    <Badge className="bg-purple-100 text-purple-700 border-0">Niveau {course.level}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Form and List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ReviewsList key={refreshKey} courseId={courseId} onReviewDeleted={() => setRefreshKey((k) => k + 1)} />
          </div>

          <div>
            <ReviewForm
              courseId={courseId}
              courseName={course.title}
              onReviewSubmitted={() => setRefreshKey((k) => k + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
