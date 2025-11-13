import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Schedule from "@/models/Schedule"
import { verifyToken } from "@/lib/jwt"
import { generateCourseChangeEmail, generateTeacherAbsenceEmail, sendEmail } from "@/lib/email-service"
import Activity from "@/models/Activity"
import Course from "@/models/Course"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params
    const token =
 req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const schedule = await Schedule.findById(id)
            .populate({ path: "course", select: "title language level", populate: { path: "teacher", select: "firstName lastName email" } })



    if (!schedule) {
      return NextResponse.json({ message: "Schedule not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        message: "Schedule fetched successfully",
        schedule,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Fetch schedule error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch schedule" }, { status: 500 })
  }
}
// PUT : modifier un créneau
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params

    const token =
 req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 })

    const { course: courseId, date, startTime, endTime, isActive } = await req.json()

    const schedule = await Schedule.findByIdAndUpdate(
      id,
      { course: courseId, date, startTime, endTime, isActive },
      { new: true }
    ).populate({
      path: "course",
      select: "title language level",
      populate: { path: "teacher", select: "firstName lastName email" },
    })

    if (!schedule) return NextResponse.json({ message: "Schedule not found" }, { status: 404 })

    const courseData = await Course.findById(schedule.course._id).populate(
      "students",
      "firstName lastName email"
    )
    if (!courseData) return NextResponse.json({ message: "Course not found" }, { status: 404 })

    // Préparer l'email et l'activité selon le type
    const scheduleDate = new Date(schedule.date).toLocaleDateString("fr-FR")
    const scheduleTime = schedule.startTime || "à définir"

    let emailSubject: string
    let emailHtml: string
    let activityType: string
    let activityDescription: string

    if (!schedule.isActive) {
      // Annulation
      emailSubject = `Annulation du cours - ${courseData.title}`
      emailHtml = generateTeacherAbsenceEmail("{studentName}", courseData.title, scheduleDate, scheduleTime)
      activityType = "TEACHER_ABSENCE"
      activityDescription = `Le professeur ${schedule.course.teacher.firstName} ${schedule.course.teacher.lastName} a annulé le cours ${courseData.title}`
    } else {
      // Modification
      emailSubject = `Modification du cours - ${courseData.title}`
      emailHtml = generateCourseChangeEmail("{studentName}", courseData.title, scheduleDate, scheduleTime)
      activityType = "SCHEDULE_CHANGE"
      activityDescription = `Le professeur ${schedule.course.teacher.firstName} ${schedule.course.teacher.lastName} a modifié le cours ${courseData.title}`
    }

    // Envoyer l'email à tous les étudiants
    await Promise.all(
      courseData.students.map((student: any) =>
        sendEmail({
          to: student.email,
          subject: emailSubject,
          html: emailHtml.replace("{studentName}", `${student.firstName} ${student.lastName}`),
        })
      )
    )

    // Créer l'activité
    const activity = new Activity({
      user: decoded.userId,
      type: activityType,
      description: activityDescription,
      metadata: {
        courseId: courseData._id.toString(),
        scheduleId: id,
        affectedStudents: courseData.students.length,
      },
    })
    await activity.save()

    return NextResponse.json({ message: "Schedule updated successfully", schedule }, { status: 200 })
  } catch (error: any) {
    console.error("Update schedule error:", error)
    return NextResponse.json({ message: error.message || "Failed to update schedule" }, { status: 500 })
  }
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params

    const token =
 req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const schedule = await Schedule.findByIdAndDelete(id)

    if (!schedule) {
      return NextResponse.json({ message: "Schedule not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        message: "Schedule deleted successfully",
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Delete schedule error:", error)
    return NextResponse.json({ message: error.message || "Failed to delete schedule" }, { status: 500 })
  }
}
