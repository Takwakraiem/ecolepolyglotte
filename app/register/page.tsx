"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)

  // ---- State global pour le formulaire ----
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    nationality: "",
    address: "",
    language: "",
    currentLevel: "",
    targetLevel: "",
    schedule: "",
    motivation: "",
    password: "",
    confirmPassword: "",
    newsletter: false,
    terms: false,
  })

  const handleChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (formData.password !== formData.confirmPassword) {
        alert("❌ Les mots de passe ne correspondent pas")
        setIsLoading(false)
        return
      }

      console.log("Données envoyées:", formData)

      const res = await fetch("http://localhost:3500/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Erreur lors de l’inscription")

      alert("✅ Bienvenue 🎉 | Utilisateur créé. Vérifiez votre email.")
      setFormData({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    nationality: "",
    address: "",
    language: "",
    currentLevel: "",
    targetLevel: "",
    schedule: "",
    motivation: "",
    password: "",
    confirmPassword: "",
    newsletter: false,
    terms: false,
  })

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
    } catch (error: any) {
      alert("❌ " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Inscription</CardTitle>
          <CardDescription>Rejoignez notre centre de formation linguistique</CardDescription>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className={`w-3 h-3 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-gray-300'}`} />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* --- STEP 1 --- */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input id="firstName" name="firstName" placeholder="Votre prénom"
                      value={formData.firstName} onChange={e => handleChange("firstName", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input id="lastName" name="lastName" placeholder="Votre nom"
                      value={formData.lastName} onChange={e => handleChange("lastName", e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" placeholder="votre@email.com"
                    value={formData.email} onChange={e => handleChange("email", e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="06 12 34 56 78"
                    value={formData.phone} onChange={e => handleChange("phone", e.target.value)} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Date de naissance</Label>
                    <Input id="birthDate" name="birthDate" type="date"
                      value={formData.birthDate} onChange={e => handleChange("birthDate", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationalité</Label>
                    <Select value={formData.nationality} onValueChange={val => handleChange("nationality", val)}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Française</SelectItem>
                        <SelectItem value="en">Anglaise</SelectItem>
                        <SelectItem value="es">Espagnole</SelectItem>
                        <SelectItem value="de">Allemande</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea id="address" name="address" placeholder="Votre adresse complète"
                    value={formData.address} onChange={e => handleChange("address", e.target.value)} />
                </div>

                <Button type="button" onClick={nextStep} className="w-full">Suivant</Button>
              </div>
            )}

            {/* --- STEP 2 --- */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Formation souhaitée</h3>

                <div className="space-y-2">
                  <Label htmlFor="language">Langue à apprendre *</Label>
                  <Select value={formData.language} onValueChange={val => handleChange("language", val)} required>
                    <SelectTrigger><SelectValue placeholder="Choisir une langue" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Anglais">Anglais</SelectItem>
                      <SelectItem value="Français">Français</SelectItem>
                      <SelectItem value="Espagnol">Espagnol</SelectItem>
                      <SelectItem value="Allemand">Allemand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentLevel">Niveau actuel *</Label>
                  <Select value={formData.currentLevel} onValueChange={val => handleChange("currentLevel", val)} required>
                    <SelectTrigger><SelectValue placeholder="Évaluer votre niveau" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debutant_A1">Débutant (A1)</SelectItem>
                      <SelectItem value="elementaire_A2">Élémentaire (A2)</SelectItem>
                      <SelectItem value="intermediaire_B1">Intermédiaire (B1)</SelectItem>
                      <SelectItem value="upper-intermediaire_B2">Intermédiaire supérieur (B2)</SelectItem>
                      <SelectItem value="avance_C1">Avancé (C1)</SelectItem>
                      <SelectItem value="maitrise_C2">Maîtrise (C2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetLevel">Niveau souhaité</Label>
                  <Select value={formData.targetLevel} onValueChange={val => handleChange("targetLevel", val)}>
                    <SelectTrigger><SelectValue placeholder="Objectif à atteindre" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elementaire_A2">Élémentaire (A2)</SelectItem>
                      <SelectItem value="intermediaire_B1">Intermédiaire (B1)</SelectItem>
                      <SelectItem value="upper-intermediaire_B2">Intermédiaire supérieur (B2)</SelectItem>
                      <SelectItem value="avance_C1">Avancé (C1)</SelectItem>
                      <SelectItem value="maitrise_C2">Maîtrise (C2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule">Préférence horaire</Label>
                  <Select value={formData.schedule} onValueChange={val => handleChange("schedule", val)}>
                    <SelectTrigger><SelectValue placeholder="Quand souhaitez-vous étudier ?" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Matin (9h-12h)</SelectItem>
                      <SelectItem value="afternoon">Après-midi (14h-17h)</SelectItem>
                      <SelectItem value="evening">Soir (18h-21h)</SelectItem>
                      <SelectItem value="weekend">Week-end</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">Motivation / Objectifs</Label>
                  <Textarea id="motivation" name="motivation" placeholder="Pourquoi souhaitez-vous apprendre cette langue ?"
                    value={formData.motivation} onChange={e => handleChange("motivation", e.target.value)} />
                </div>

                <div className="flex space-x-3">
                  <Button type="button" onClick={prevStep} variant="outline" className="flex-1">Précédent</Button>
                  <Button type="button" onClick={nextStep} className="flex-1">Suivant</Button>
                </div>
              </div>
            )}

            {/* --- STEP 3 --- */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Finalisation</h3>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <div className="relative">
                    <Input id="password" name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => handleChange("password", e.target.value)}
                      required />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                  <div className="relative">
                    <Input id="confirmPassword" name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={e => handleChange("confirmPassword", e.target.value)}
                      required />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" checked={formData.newsletter} onCheckedChange={val => handleChange("newsletter", val)} />
                  <Label htmlFor="newsletter" className="text-sm">Je souhaite recevoir les actualités et offres spéciales</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required checked={formData.terms} onCheckedChange={val => handleChange("terms", val)} />
                  <Label htmlFor="terms" className="text-sm">
                    J'accepte les <Link href="/terms" className="text-blue-600 hover:underline">conditions</Link> et la <Link href="/privacy" className="text-blue-600 hover:underline">politique</Link>
                  </Label>
                </div>

                <div className="flex space-x-3">
                  <Button type="button" onClick={prevStep} variant="outline" className="flex-1">Précédent</Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>{isLoading ? "Inscription..." : "S'inscrire"}</Button>
                </div>
              </div>
            )}
          </form>
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              Déjà inscrit ?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Se connecter
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
