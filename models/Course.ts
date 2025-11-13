import mongoose, { Schema, type Document } from "mongoose"

export interface ICourse extends Document {
  title: string
  description: string
  language: string
  level: string
  teacher: mongoose.Types.ObjectId
  students: mongoose.Types.ObjectId[]
  maxStudents: number
  startDate: Date
  endDate: Date
  totalReviews:number
  rating:number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    language: { type: String, required: true },
    level: { type: String, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
    maxStudents: { type: Number, default: 30 },
    startDate: { type: Date, required: true },
      totalReviews:{ type: Number },
  rating:{ type: Number },
    endDate: { type: Date, required: true },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema)
