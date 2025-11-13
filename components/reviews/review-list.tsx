"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ThumbsUp, Trash2 } from "lucide-react"

interface Review {
  _id: string
  rating: number
  title: string
  comment: string
  helpful: number
  student: {
    _id: string
    firstName: string
    lastName: string
  }
  createdAt: string
}

interface ReviewsListProps {
  courseId: string
  onReviewDeleted?: () => void
}

export function ReviewsList({ courseId, onReviewDeleted }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      setUserId(JSON.parse(user).id)
    }

    fetchReviews()
  }, [courseId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?courseId=${courseId}`)
      const data = await response.json()
      setReviews(data.reviews || [])
      setAverageRating(Number.parseFloat(data.averageRating) || 0)
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })

      if (response.ok) {
        setReviews(reviews.filter((r) => r._id !== reviewId))
        onReviewDeleted?.()
      }
    } catch (error) {
      console.error("Failed to delete review:", error)
    }
  }

  const handleHelpful = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/helpful/${reviewId}`, {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setReviews(reviews.map((r) => (r._id === reviewId ? data.review : r)))
      }
    } catch (error) {
      console.error("Failed to update helpful count:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Chargement des avis...</div>
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Avis des étudiants</CardTitle>
            <CardDescription>Retours d'expérience sur ce cours</CardDescription>
          </div>
          {reviews.length > 0 && (
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {averageRating.toFixed(1)}/5 ({reviews.length} avis)
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Aucun avis pour le moment</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border-2 border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{review.title}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      par {review.student.firstName} {review.student.lastName}
                    </p>
                  </div>
                  {userId === review.student._id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <p className="text-gray-700 mb-3">{review.comment}</p>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString("fr-FR")}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleHelpful(review._id)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Utile ({review.helpful})
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
