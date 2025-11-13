import { NextResponse } from "next/server"
import Course from "@/models/Course"
import {dbConnect} from "@/lib/db"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
   await dbConnect()

  try {
    const { id } = await params
    const { students } = await req.json()

    if (!students || !Array.isArray(students)) {
      return NextResponse.json(
        { message: "Invalid request. 'students' must be an array of student IDs." },
        { status: 400 }
      )
    }

    const course = await Course.findById(id)
    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 })
    }

    // Vérifie si le nombre d’étudiants ne dépasse pas le maximum
    const totalStudents = course.students.length + students.length
    if (totalStudents > course.maxStudents) {
      return NextResponse.json(
        { message: `Cannot assign students. Max limit of ${course.maxStudents} exceeded.` },
        { status: 400 }
      )
    }

    // Évite les doublons
    const uniqueStudents = [
      ...new Set([...course.students.map(String), ...students.map(String)]),
    ]

    course.students = uniqueStudents
    await course.save()

    return NextResponse.json(
      { message: "Students successfully assigned", course },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error assigning students:", error)
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    )
  }
}
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await   dbConnect()

  try {
    const { id } = await params
    const { studentId } = await req.json()

    const course = await Course.findById(id)
    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 })
    }

    course.students = course.students.filter((s: any) => s.toString() !== studentId)
    await course.save()

    return NextResponse.json(
      { message: "Student removed successfully", course },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error removing student:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
