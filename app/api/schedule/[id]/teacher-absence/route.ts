import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Schedule from "@/models/Schedule"
import Course from "@/models/Course"
import Activity from "@/models/Activity"
import { verifyToken } from "@/lib/jwt"
import { sendEmail, generateTeacherAbsenceEmail } from "@/lib/email-service"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const token =
 req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const scheduleId = params.id

    // Récupérer le créneau
    const schedule = await Schedule.findById(scheduleId)
    .populate({ path: "course", select: "title language level", populate: { path: "teacher", select: "firstName lastName email" } })


    if (!schedule) {
      return NextResponse.json({ message: "Schedule not found" }, { status: 404 })
    }

    // Récupérer le cours et les étudiants
    const course = await Course.findById(schedule.course._id).populate("students", "firstName lastName email")

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 })
    }

    // Préparer les emails
    const studentEmails = course.students.map((student: any) => student.email)
    const scheduleDate = new Date(schedule.date).toLocaleDateString("fr-FR")
    const emailSubject = `Annulation du cours - ${course.title}`

    // Envoyer les emails aux étudiants
    const emailPromises = course.students.map((student: any) =>
      sendEmail({
        to: student.email,
        subject: emailSubject,
        html: generateTeacherAbsenceEmail(
          `${student.firstName} ${student.lastName}`,
          course.title,
          scheduleDate,
          schedule.startTime,
        ),
      }),
    )

    await Promise.all(emailPromises)



    // Créer une activité
    const activity = new Activity({
      user: decoded.userId,
      type: "TEACHER_ABSENCE",
      description: `Le professeur ${schedule.course.teacher.firstName} ${schedule.course.teacher.lastName} a marqué une absence pour le cours ${course.title}`,
      metadata: {
        courseId: course._id.toString(),
        scheduleId: scheduleId,
        affectedStudents: course.students.length,
      },
    })

    await activity.save()

    // Marquer le créneau comme inactif
    schedule.isActive = false
    await schedule.save()

    return NextResponse.json(
      {
        message: "Teacher absence recorded and notifications sent",
        affectedStudents: course.students.length,
        activity,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Teacher absence error:", error)
    return NextResponse.json({ message: error.message || "Failed to record teacher absence" }, { status: 500 })
  }
}
