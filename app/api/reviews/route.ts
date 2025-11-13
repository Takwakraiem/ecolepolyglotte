import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Review from "@/models/Review"
import { verifyToken } from "@/lib/jwt"
import Course from "@/models/Course"
export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const token =
 req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { courseId, rating, title, comment } = await req.json()

    if (!courseId || !rating || !title || !comment) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Vérifier si l'utilisateur a déjà noté ce cours
    const existingReview = await Review.findOne({
      course: courseId,
      student: decoded.userId,
    })

    if (existingReview) {
      return NextResponse.json({ message: "You already reviewed this course" }, { status: 400 })
    }

    // Créer la nouvelle review
    const review = new Review({
      course: courseId,
      student: decoded.userId,
      rating,
      title,
      comment,
    })
    await review.save()

    // Recalculer la moyenne et le total de reviews
    const allReviews = await Review.find({ course: courseId })
    const averageRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0
    const totalReviews = allReviews.length

    // Mettre à jour le cours avec la nouvelle moyenne et le total
    await Course.findByIdAndUpdate(courseId, {
      rating: averageRating.toFixed(1),
      totalReviews,
    })

    return NextResponse.json(
      {
        message: "Review created successfully and course rating updated",
        review,
        newAverage: averageRating.toFixed(1),
        totalReviews,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Review creation error:", error)
    return NextResponse.json({ message: error.message || "Failed to create review" }, { status: 500 })
  }
}
export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json({ message: "Course ID is required" }, { status: 400 })
    }

    const reviews = await Review.find({ course: courseId })
      .populate("student", "firstName lastName")
      .sort({ createdAt: -1 })

    const averageRating =
      reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0

    return NextResponse.json(
      {
        message: "Reviews fetched successfully",
        reviews,
        averageRating,
        totalReviews: reviews.length,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Reviews fetch error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch reviews" }, { status: 500 })
  }
}
