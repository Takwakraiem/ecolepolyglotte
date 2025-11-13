"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { api, apiCall } from "@/lib/api-client"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export function AnalyticsDashboard() {
  const [enrollmentStats, setEnrollmentStats] = useState<any[]>([])
  const [courseStats, setCourseStats] = useState<any[]>([])
  const [growthData, setGrowthData] = useState<any[]>([])
  const [activityData, setActivityData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [enrollment, courses, growth, activity] = await Promise.all([
          apiCall("/api/statistics/enrollment"),
          apiCall("/api/statistics/courses"),
          apiCall("/api/statistics/growth"),
          apiCall("/api/statistics/activity"),
        ])

        setEnrollmentStats(enrollment.enrollmentStats || [])
        setCourseStats(courses.courseStats || [])
        setGrowthData(growth.studentGrowth || [])
        setActivityData(activity.activityData || [])
      } catch (error) {
        console.error("Failed to load analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Chargement des analytics...</div>
  }

  return (
    <div className="space-y-8">
      {/* Enrollment by Language */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Inscriptions par langue</CardTitle>
          <CardDescription>Distribution des inscriptions par langue</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={enrollmentStats}
                dataKey="totalEnrollments"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {enrollmentStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Course Statistics */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Statistiques des cours</CardTitle>
          <CardDescription>Répartition des cours par niveau</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Nombre de cours" />
              <Bar dataKey="totalStudents" fill="#10b981" name="Étudiants" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Growth Trend */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Croissance des étudiants</CardTitle>
          <CardDescription>Tendance d'inscription sur 12 mois</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Nouveaux étudiants" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activity Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>Activité des 7 derniers jours</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" name="Activités" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
