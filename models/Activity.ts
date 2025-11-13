import mongoose, { Schema, type Document } from "mongoose"

export type ActivityType =
  | "USER_REGISTRATION"
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DELETED"
  | "COURSE_CREATED"
  | "COURSE_UPDATED"
  | "COURSE_DELETED"
  | "STUDENT_ENROLLED"
  | "SCHEDULE_CREATED"
  | "SCHEDULE_UPDATED"
  | "TEACHER_ABSENCE"
  | "MESSAGE_SENT"
  | "SCHEDULE_CHANGE" 

export interface IActivity extends Document {
  user: mongoose.Types.ObjectId
  type: ActivityType
  description: string
  metadata?: {
    courseId?: string
    scheduleId?: string
    affectedStudents?: number
  }
  createdAt: Date
  updatedAt: Date
}

const ActivitySchema = new Schema<IActivity>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "USER_REGISTRATION",
        "USER_CREATED",
        "USER_UPDATED",
        "USER_DELETED",
        "COURSE_CREATED",
        "COURSE_UPDATED",
        "COURSE_DELETED",
        "STUDENT_ENROLLED",
        "SCHEDULE_CREATED",
        "SCHEDULE_UPDATED",
        "TEACHER_ABSENCE",
        "MESSAGE_SENT",
        "SCHEDULE_CHANGE",
      ],
      required: true,
    },
    description: { type: String, required: true },
    metadata: {
      courseId: String,
      scheduleId: String,
      affectedStudents: Number,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema)
