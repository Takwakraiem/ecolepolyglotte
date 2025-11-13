import { dbConnect } from "@/lib/db"
import Activity from "@/models/Activity"

export async function logActivity(
  type:
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
    | "MESSAGE_SENT",
  userId: string,
  description: string,
  metadata?: Record<string, any>,
) {
  try {
    await dbConnect()

    const activity = new Activity({
      type,
      user: userId,
      description,
      metadata: metadata || {},
      timestamp: new Date(),
    })

    await activity.save()
    return activity
  } catch (error) {
    console.error("[Activity Logger] Error logging activity:", error)
    // Don't throw - activity logging should not break the main operation
  }
}
