"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  GraduationCap,
  MessageSquare,
  Settings,
  Plus,
  Search,
  Crown,
  Shield,
  Zap,
  BarChart3,
  ArrowRight,
  Bell,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { useRouter } from "next/navigation"
import { ActivityFeed } from "@/components/activity/activity-feed"
import { RecentActivities } from "@/components/admin/recent-activities"

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const response = await api.getStatistics()
        setStats(response.statistics)
        console.log(response);

      } catch (error) {
        console.error("Failed to load statistics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStatistics()
  }, [])

  const statsCards = [
    {
      title: "Étudiants actifs",
      value: stats?.totalStudents || "0",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Cours disponibles",
      value: stats?.totalCourses || "0",
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "Formateurs actifs",
      value: stats?.totalTeachers || "0",
      icon: GraduationCap,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
    {
      title: "Cours actifs",
      value: stats?.activeCourses || "0",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
    },
  ]



  const quickActions = [
    {
      title: "Nouvel étudiant",
      description: "Ajouter un étudiant",
      icon: Plus,
      href: "/admin/students/new",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Nouveau cours",
      description: "Créer une formation",
      icon: BookOpen,
      href: "/admin/courses/new",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Nouveau formateur",
      description: "Ajouter un enseignant",
      icon: GraduationCap,
      href: "/admin/teachers/new",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Gérer planning",
      description: "Organiser les cours",
      icon: Calendar,
      href: "/admin/schedule",
      color: "from-orange-500 to-orange-600",
    },
  ]

  const managementCards = [
    {
      title: "Gestion étudiants",
      description: `${stats?.totalStudents || 0} étudiants actifs`,
      icon: Users,
      href: "/admin/students",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Gestion cours",
      description: `${stats?.totalCourses || 0} formations disponibles`,
      icon: BookOpen,
      href: "/admin/courses",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "Formateurs",
      description: `${stats?.totalTeachers || 0} enseignants actifs`,
      icon: GraduationCap,
      href: "/admin/teachers",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
    {
      title: "Analytics",
      description: "Rapports et statistiques",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
    },

    {
      title: "Langues",
     description: `${stats?.totalLangues || 0} Langues`,
      icon: Settings,
      href: "/admin/langues",
      color: "from-gray-500 to-gray-600",
      bgColor: "from-gray-50 to-gray-100",
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
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

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  </div>
</header>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tableau de bord administrateur</h1>
          <p className="text-xl text-gray-600">Contrôle total de votre centre de formation linguistique</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                 
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
              <Zap className="h-6 w-6 mr-2 text-yellow-500" />
              Actions rapides
            </CardTitle>
            <CardDescription className="text-lg">Raccourcis vers les tâches les plus courantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
          <RecentActivities />
        </div>

        {/* Management Cards */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-purple-500" />
              Gestion complète
            </CardTitle>
            <CardDescription className="text-lg">Accès à tous les modules de gestion de votre centre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {managementCards.map((card, index) => (
                <Link key={index} href={card.href}>
                  <Card className="border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group overflow-hidden">
                    <div className={`h-1 bg-gradient-to-r ${card.color}`}></div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${card.bgColor} group-hover:scale-110 transition-transform`}
                        >
                          <card.icon
                            className={`h-6 w-6 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}
                          />
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                      <p className="text-sm text-gray-600">{card.description}</p>
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
