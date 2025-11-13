import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Review from "@/models/Review"
import { verifyToken } from "@/lib/jwt"

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    const review = await Review.findById(params.id)

    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 })
    }

    if (review.student.toString() !== decoded.userId && decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await Review.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Review deletion error:", error)
    return NextResponse.json({ message: error.message || "Failed to delete review" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const review = await Review.findById(params.id)

    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 })
    }

    if (review.student.toString() !== decoded.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { rating, title, comment } = await req.json()

    if (rating) review.rating = rating
    if (title) review.title = title
    if (comment) review.comment = comment

    await review.save()

    return NextResponse.json(
      {
        message: "Review updated successfully",
        review,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Review update error:", error)
    return NextResponse.json({ message: error.message || "Failed to update review" }, { status: 500 })
  }
}
