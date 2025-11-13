import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Schedule from "@/models/Schedule"
import { verifyToken } from "@/lib/jwt"
import { logActivity } from "@/lib/activity-logger"

export async function GET(req: NextRequest) {
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

    const schedules = await Schedule.find({ isActive: true })
      .populate({ path: "course", select: "title language level", populate: { path: "teacher", select: "firstName lastName email" } })
      .sort({ date: 1 })

    return NextResponse.json(
      {
        message: "Schedules fetched successfully",
        count: schedules.length,
        schedules,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Fetch schedules error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch schedules" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
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

    const { course, date, startTime,dayOfWeek, endTime } = await req.json()

    const schedule = new Schedule({
      course,
      startTime,
      endTime,
      date,
      dayOfWeek,
    })

    await schedule.save()
    await schedule.populate("course", "title language level")
   await logActivity("SCHEDULE_CREATED", decoded.userId, `Created schedule for ${date} at ${startTime}`, {
      scheduleId: schedule._id.toString(),
      date,
      startTime,
      endTime
    })

    return NextResponse.json(
      {
        message: "Schedule created successfully",
        schedule,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create schedule error:", error)
    return NextResponse.json({ message: error.message || "Failed to create schedule" }, { status: 500 })
  }
}
