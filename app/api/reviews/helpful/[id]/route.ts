import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Review from "@/models/Review"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const review = await Review.findByIdAndUpdate(params.id, { $inc: { helpful: 1 } }, { new: true })

    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        message: "Helpful count updated",
        review,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Helpful update error:", error)
    return NextResponse.json({ message: error.message || "Failed to update helpful count" }, { status: 500 })
  }
}
