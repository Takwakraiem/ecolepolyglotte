"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, MessageSquare, ArrowRight, User, Star, LogOut } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { api, apiCall } from "@/lib/api-client"
import { useRouter } from "next/navigation"
import { ActivityFeed } from "@/components/activity/activity-feed"

interface Course {
  _id: string
  title: string
  language: string
  level: string
  teacher: { firstName: string; lastName: string }
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

export default function StudentDashboard() {
  const [user, setUser] = useState<any>({})
  const [courses, setCourses] = useState<Course[]>([])
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const profile = await apiCall("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(profile)

        const coursesResponse = await api.getCoursebyuser()
        setCourses(coursesResponse.courses || [])

        const scheduleResponse = await api.getSchedulesbyStudent()
        setSchedule(scheduleResponse.schedules || [])
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Erreur lors du chargement")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    )
  }

  const studentInfo = {
    name: `${user.firstName || ""} ${user.lastName || ""}`,
    email: user.email,
    level: user.currentLevel || "B2",
    language: user.language || "Anglais",
  }
const upcomingClasses = schedule
  .filter((s) => {
    const courseDateTime = new Date(s.date) // s.date est déjà une Date
    courseDateTime.setHours(parseInt(s.startTime.split(":")[0]))
    courseDateTime.setMinutes(parseInt(s.startTime.split(":")[1]))
    return courseDateTime >= new Date()
  })
  .sort((a, b) => {
    const dateA = new Date(a.date)
    dateA.setHours(parseInt(a.startTime.split(":")[0]))
    dateA.setMinutes(parseInt(a.startTime.split(":")[1]))
    const dateB = new Date(b.date)
    dateB.setHours(parseInt(b.startTime.split(":")[0]))
    dateB.setMinutes(parseInt(b.startTime.split(":")[1]))
    return dateA.getTime() - dateB.getTime()
  })
  .slice(0, 3)
  .map((s: ScheduleItem) => ({
    title: s.course.title,
    dateTime: `${new Date(s.date).toLocaleDateString("fr-FR")} ${s.startTime} - ${s.endTime}`,
    teacher: `${s.course.teacher?.firstName} ${s.course.teacher?.lastName}`,
    color: "from-blue-500 to-blue-600",
  }))


  const quickActions = [
    { title: "Mes cours", description: "Accéder aux formations", icon: BookOpen, href: "/student/courses", color: "from-blue-500 to-blue-600" },
    { title: "Planning", description: "Emploi du temps", icon: Calendar, href: "/student/schedule", color: "from-green-500 to-green-600" },
    { title: "Messages", description: "Communication", icon: MessageSquare, href: "/student/messages", color: "from-orange-500 to-orange-600" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-20">
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
          <span className="ml-3 text-2xl font-bold text-gray-900">Polyglotte formation</span>
        </Link>
        <Badge className="ml-4 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 flex items-center">
          <User className="h-3 w-3 mr-1" />
          Étudiant
        </Badge>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/profile" className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
          <User className="h-5 w-5 mr-2" /> Profil
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
        >
          <LogOut className="h-5 w-5 mr-2" /> Déconnexion
        </Button>
      </div>
    </div>
  </div>
</header>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bonjour, {studentInfo.name} 👋</h1>
          <p className="text-xl text-gray-600">
            Continuez votre apprentissage de l'{studentInfo.language} - Niveau {studentInfo.level}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Upcoming Classes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" /> Cours à venir
              </CardTitle>
              <CardDescription>Votre planning de la semaine</CardDescription>
            </CardHeader>
           <CardContent>
  {upcomingClasses.length === 0 ? (
    <p className="text-gray-500">Aucun cours à venir pour le moment.</p>
  ) : (
    <div className="space-y-4">
      {upcomingClasses.map((class_, index) => (
        <div key={index} className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 transition-colors">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${class_.color} rounded-xl flex items-center justify-center`}>
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{class_.title}</h3>
              <p className="text-sm text-gray-600">{class_.dateTime} • {class_.teacher}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
  <Link href="/student/schedule" className="inline-flex items-center mt-4 px-4 py-2 border-2 border-gray-200 hover:bg-gray-50 rounded">
    Voir planning complet <ArrowRight className="ml-2 h-4 w-4" />
  </Link>
</CardContent>

          </Card>
        </div>

        {/* Courses */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" /> Mes cours
            </CardTitle>
            <CardDescription>Accédez à vos formations et laissez des avis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.slice(0, 6).map((course) => (
                <Link key={course._id} href={`/student/courses/${course._id}/reviews`}>
                  <Card className="border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 group-hover:scale-110 transition-transform">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">{course.level}</Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{course.language}</p>
                      <Button variant="outline" size="sm" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 bg-transparent">
                        <Star className="h-4 w-4 mr-1" /> Laisser un avis
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
