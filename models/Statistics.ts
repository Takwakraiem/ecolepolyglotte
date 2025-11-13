import mongoose, { Schema, type Document } from "mongoose"

export interface IStatistics extends Document {
  totalStudents: number
  totalTeachers: number
  totalCourses: number
  activeCourses: number
  totalEnrollments: number
  recentActivities: {
    type: string
    description: string
    timestamp: Date
  }[]
  updatedAt: Date
}

const StatisticsSchema = new Schema<IStatistics>(
  {
    totalStudents: { type: Number, default: 0 },
    totalTeachers: { type: Number, default: 0 },
    totalCourses: { type: Number, default: 0 },
    activeCourses: { type: Number, default: 0 },
    totalEnrollments: { type: Number, default: 0 },
    recentActivities: [
      {
        type: String,
        description: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
)

export default mongoose.models.Statistics || mongoose.model<IStatistics>("Statistics", StatisticsSchema)
