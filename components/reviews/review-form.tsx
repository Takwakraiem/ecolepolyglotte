"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface ReviewFormProps {
  courseId: string
  courseName: string
  onReviewSubmitted?: () => void
}

export function ReviewForm({ courseId, courseName, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!rating || !title || !comment) {
      setError("Veuillez remplir tous les champs")
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          courseId,
          rating,
          title,
          comment,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'avis")
      }

      setSuccess(true)
      setRating(0)
      setTitle("")
      setComment("")

      setTimeout(() => {
        onReviewSubmitted?.()
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Laisser un avis</CardTitle>
        <CardDescription>Partagez votre expérience sur le cours {courseName}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Note</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star className={`h-8 w-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
            {rating > 0 && <Badge className="mt-2 bg-yellow-100 text-yellow-700 border-0">{rating}/5 étoiles</Badge>}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Titre</label>
            <Input
              placeholder="Résumez votre avis en quelques mots"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-2 focus:border-blue-500"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Commentaire</label>
            <Textarea
              placeholder="Décrivez votre expérience avec ce cours..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="border-2 focus:border-blue-500"
            />
          </div>

          {/* Error/Success Messages */}
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              Avis publié avec succès!
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
          >
            {loading ? "Publication..." : "Publier l'avis"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
