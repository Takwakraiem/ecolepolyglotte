"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, BookOpen, Award, ArrowLeft, Save, Camera, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api, apiCall } from "@/lib/api-client"
import { toast } from "sonner"

export default function StudentProfile() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [profile, setProfile] = useState<any>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    language: "",
    currentLevel: "",
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const response = await apiCall("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setProfile(response)
        console.log(response);
        
        setFormData({
          firstName: response.firstName || "",
          lastName: response.lastName || "",
          email: response.email || "",
          phone: response.phone || "",

          language: response.language || "",
          currentLevel: response.currentLevel || "",
        })
      } catch (error) {
        console.error("Failed to load profile:", error)
        toast.error("Impossible de charger le profil")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Tous les champs sont requis")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas")
      return
    }

    setSaving(true)
    try {
      const token = localStorage.getItem("token")
      const response = await apiCall("/api/profile/change-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      })

      toast.success("Mot de passe changé avec succès")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setShowPasswordForm(false)
    } catch (error: any) {
      console.error("Failed to change password:", error)
      toast.error(error.message || "Erreur lors du changement de mot de passe")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("token")
      const response = await apiCall("/api/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      setProfile(response.user)
      toast.success("Profil mis à jour avec succès")
    } catch (error) {
      console.error("Failed to save profile:", error)
      toast.error("Erreur lors de la mise à jour du profil")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/student/dashboard" className="flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour au tableau de bord
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <Card className="mb-8 border-0 shadow-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <CardContent className="p-6 -mt-16 relative">
            <div className="flex items-end space-x-6">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={profile?.avatar || "/placeholder.svg"} alt={profile?.firstName} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl">
                    {profile?.firstName?.charAt(0)}
                    {profile?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="pb-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  {profile?.firstName} {profile?.lastName}
                </h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  {profile?.email}
                </p>
                <Badge className="mt-3 bg-blue-100 text-blue-700 border-0">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Étudiant
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Informations Personnelles
                </CardTitle>
                <CardDescription>Mettez à jour vos informations de base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Votre prénom"
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-50 border-gray-300 text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+33 6 12 34 56 78"
                    className="border-gray-300"
                  />
                </div>


              </CardContent>
            </Card>

            {/* Learning Information */}
            <Card className="border-0 shadow-lg" >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                  Informations d'Apprentissage
                </CardTitle>
                <CardDescription>Vos préférences d'apprentissage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                    <Select disabled value={formData.language} onValueChange={(value) => handleSelectChange("language", value)}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Sélectionnez une langue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Anglais">Anglais</SelectItem>
                        <SelectItem value="Espagnol">Espagnol</SelectItem>
                        <SelectItem value="Allemand">Allemand</SelectItem>
                        <SelectItem value="Français">Français</SelectItem>
                        <SelectItem value="Italien">Italien</SelectItem>
                        <SelectItem value="Portugais">Portugais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Niveau Actuel</label>
                    <Select disabled
                      value={formData.currentLevel}
                      onValueChange={(value) => handleSelectChange("currentLevel", value)}
                    >
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Sélectionnez un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A1">A1 - Débutant</SelectItem>
                        <SelectItem value="A2">A2 - Élémentaire</SelectItem>
                        <SelectItem value="B1">B1 - Intermédiaire</SelectItem>
                        <SelectItem value="B2">B2 - Intermédiaire Supérieur</SelectItem>
                        <SelectItem value="C1">C1 - Avancé</SelectItem>
                        <SelectItem value="C2">C2 - Maîtrise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-red-600" />
                  Sécurité
                </CardTitle>
                <CardDescription>Gérez votre mot de passe</CardDescription>
              </CardHeader>
              <CardContent>
                {!showPasswordForm ? (
                  <Button
                    onClick={() => setShowPasswordForm(true)}
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                      <Input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Entrez votre mot de passe actuel"
                        className="border-gray-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                      <Input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Entrez votre nouveau mot de passe"
                        className="border-gray-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirmez votre nouveau mot de passe"
                        className="border-gray-300"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleChangePassword}
                        disabled={saving}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0"
                      >
                        {saving ? "Changement..." : "Confirmer"}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowPasswordForm(false)
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          })
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 h-12 text-base"
            >
              <Save className="h-5 w-5 mr-2" />
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-500" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">Rôle</p>
                  <p className="text-lg font-semibold text-gray-900">Étudiant</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-600">Statut</p>
                  <Badge className="bg-green-100 text-green-700 border-0 mt-2">
                    <span className="inline-block h-2 w-2 bg-green-600 rounded-full mr-2"></span>
                    Actif
                  </Badge>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-gray-600">Membre depuis</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("fr-FR") : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Besoin d'aide?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Contactez notre équipe d'assistance pour toute question.</p>
                <Button
                  variant="outline"
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  Contacter le support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
