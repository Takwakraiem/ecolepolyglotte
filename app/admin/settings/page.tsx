"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Settings, Bell, Lock, Users, Palette } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="flex items-center">
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
                Admin
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600">Gérez les paramètres de votre plateforme</p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-blue-500" />
                Paramètres généraux
              </CardTitle>
              <CardDescription>Informations de base de votre école</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="schoolName">Nom de l'école</Label>
                <Input id="schoolName" defaultValue="Polyglotte formation" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="email">Email de contact</Label>
                <Input id="email" type="email" defaultValue="contact@ecolelangues.com" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" defaultValue="+33 1 23 45 67 89" className="mt-2" />
              </div>
              <Button>Enregistrer les modifications</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-green-500" />
                Notifications
              </CardTitle>
              <CardDescription>Gérez vos préférences de notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Notifications par email</Label>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <Label>Alertes d'inscription</Label>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <Label>Rapports hebdomadaires</Label>
                <input type="checkbox" className="w-4 h-4" />
              </div>
              <Button>Enregistrer les préférences</Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-red-500" />
                Sécurité
              </CardTitle>
              <CardDescription>Gérez la sécurité de votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline">Changer le mot de passe</Button>
              <Button variant="outline">Authentification à deux facteurs</Button>
              <Button variant="outline">Sessions actives</Button>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-500" />
                Gestion des utilisateurs
              </CardTitle>
              <CardDescription>Gérez les rôles et les permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline">Gérer les rôles</Button>
              <Button variant="outline">Permissions</Button>
              <Button variant="outline">Audit des accès</Button>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2 text-orange-500" />
                Apparence
              </CardTitle>
              <CardDescription>Personnalisez l'apparence de votre plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="theme">Thème</Label>
                <select id="theme" className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md">
                  <option>Clair</option>
                  <option>Sombre</option>
                  <option>Auto</option>
                </select>
              </div>
              <Button>Enregistrer les préférences</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
