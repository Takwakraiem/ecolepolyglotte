"use client"

import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Crown, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics et Statistiques</h1>
          <p className="text-xl text-gray-600">Visualisez les données de votre plateforme</p>
        </div>

        <AnalyticsDashboard />
      </div>
    </div>
  )
}
