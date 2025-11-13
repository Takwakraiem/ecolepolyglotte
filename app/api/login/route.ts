// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import User from "@/models/User"
import { generateToken } from "@/lib/jwt" // Assure-toi que cette fonction existe

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // ✅ Générer le token avec l'ID et le rôle
    const token = generateToken(user._id.toString(), user.role, user.email)

    // ✅ Supprimer le mot de passe avant de renvoyer l'objet
    const { password: _, ...userData } = user.toObject()

    // ✅ Créer la réponse
    const response = NextResponse.json({
      message: "Connexion réussie",
      user: userData,
      token,
      redirectTo:
        user.role === "ADMIN"
          ? "/admin/dashboard"
          : user.role === "TEACHER"
          ? "/teacher/dashboard"
          : "/student/dashboard",
    })

    // ✅ Définir le cookie JWT
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ message: error.message || "Login failed" }, { status: 500 })
  }
}
