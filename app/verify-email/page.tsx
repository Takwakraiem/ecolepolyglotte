"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Loader2, RefreshCcw } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Vérification de votre email...")

  const [canResend, setCanResend] = useState(false)
  const [countdown, setCountdown] = useState(30)

  // Vérifier l'email au chargement de la page
  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Token manquant ou invalide.")
      return
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`http://localhost:3500/api/verify-email?token=${token}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Erreur lors de la vérification")

        setStatus("success")
        setMessage(data.message || "Votre email a été vérifié avec succès ! 🎉")
        setCanResend(true)
      } catch (err: any) {
        setStatus("error")
        setMessage(err.message || "Erreur lors de la vérification de l'email")
        setCanResend(true)
      }
    }

    verifyEmail()
  }, [token])

  // Gestion du countdown pour le resend
  useEffect(() => {
    if (!canResend) return
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [canResend])

  const handleResend = async () => {
    if (!token) return
    setStatus("loading")
    setCountdown(30)
    setCanResend(false)

    try {
      const res = await fetch(`http://localhost:3500/api/resend-verification?token=${token}`, {
        method: "POST"
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Impossible de renvoyer le mail")

      setStatus("success")
      setMessage("Email de vérification renvoyé ! 📧")
      setCanResend(true)
    } catch (err: any) {
      setStatus("error")
      setMessage(err.message || "Erreur lors du renvoi de l'email")
      setCanResend(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center space-x-2">
            {status === "success" ? (
              <CheckCircle className="text-green-500 h-8 w-8 animate-bounce" />
            ) : (
              <Mail className="h-8 w-8 text-blue-500" />
            )}
            <span>Vérification Email</span>
          </CardTitle>
          <CardDescription className="mt-2">{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === "loading" && <Loader2 className="animate-spin h-8 w-8 text-blue-500" />}

          {status === "success" && (
            <>
              <Link href="/login">
                <Button className="w-full">Aller au Login</Button>
              </Link>
            </>
          )}


        </CardContent>
      </Card>
    </div>
  )
}
