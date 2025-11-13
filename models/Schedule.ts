import mongoose, { Schema, type Document } from "mongoose"

export interface ISchedule extends Document {
  course: mongoose.Types.ObjectId
  // teacher: mongoose.Types.ObjectId
  date: Date
  startTime: string
  endTime: string
  // room: string
  dayOfWeek: string
  // topic: string
  // materials?: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ScheduleSchema = new Schema<ISchedule>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    // teacher: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date },
    startTime: { type: String, required: true },
    dayOfWeek: { type: String },
    endTime: { type: String, required: true },
    // room: { type: String, required: true },
    // topic: { type: String },
    // materials: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.models.Schedule || mongoose.model<ISchedule>("Schedule", ScheduleSchema)
