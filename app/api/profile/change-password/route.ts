import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import User from "@/models/User"
import { verifyToken } from "@/lib/jwt"

export async function POST(req: NextRequest) {
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

    const { currentPassword, newPassword, confirmPassword } = await req.json()

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ message: "Tous les champs sont requis" }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ message: "Les nouveaux mots de passe ne correspondent pas" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "Le mot de passe doit contenir au moins 6 caractères" }, { status: 400 })
    }

    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Le mot de passe actuel est incorrect" }, { status: 401 })
    }

    // Update password
    user.password = newPassword
    await user.save()

    return NextResponse.json({ message: "Mot de passe changé avec succès" }, { status: 200 })
  } catch (error: any) {
    console.error("Change password error:", error)
    return NextResponse.json({ message: error.message || "Erreur lors du changement de mot de passe" }, { status: 500 })
  }
}
