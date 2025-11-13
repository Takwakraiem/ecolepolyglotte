import mongoose, { Schema, type Document } from "mongoose"

export interface IReview extends Document {
  course: mongoose.Types.ObjectId
  student: mongoose.Types.ObjectId
  rating: number
  title: string
  comment: string
  helpful: number
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    helpful: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema)
