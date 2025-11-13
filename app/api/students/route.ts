import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import User from "@/models/User"
import { verifyToken } from "@/lib/jwt"
import { logActivity } from "@/lib/activity-logger"
import { sendEmail } from "@/lib/email-service"

export async function GET(req: NextRequest) {
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

    const students = await User.find({ role: "STUDENT" }).select("-password")

    return NextResponse.json(
      {
        message: "Students fetched successfully",
        count: students.length,
        students,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Fetch students error:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch students" }, { status: 500 })
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

    const { firstName, lastName, email, password, language, currentLevel , phone } = await req.json()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const student = new User({
      firstName,
      lastName,
      email,
      password,
      role: "STUDENT",
      language,
      currentLevel,
      phone,
    })

    await student.save()
     await logActivity("USER_CREATED", decoded.userId, `Created student ${firstName} ${lastName}`, {
      studentId: student._id.toString(),
      email,
      language,
      currentLevel,
    })
const emailSubject = "Bienvenue à Polyglotte formation  - Vos identifiants étudiant";
const emailHtml = `
  <h2>Bienvenue, ${student.firstName} ${student.lastName} !</h2>
  <p>Nous sommes ravis de vous accueillir à Polyglotte formation. Voici vos identifiants de connexion :</p>
  <p><strong>Email :</strong> ${student.email}</p>
  <p><strong>Mot de passe :</strong> ${password}</p>
  <p>Veuillez garder vos identifiants en sécurité. Vous pouvez vous connecter à votre tableau de bord étudiant en utilisant le lien ci-dessous :</p>
  <p><a href="https://ecolelangues.com/student/login">Se connecter à votre tableau de bord</a></p>
`;

await sendEmail({
  to: student.email,
  subject: emailSubject,
  html: emailHtml,
});

    return NextResponse.json(
      {
        message: "Student created successfully",
        student: {
          id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          role: student.role,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create student error:", error)
    return NextResponse.json({ message: error.message || "Failed to create student" }, { status: 500 })
  }
}
