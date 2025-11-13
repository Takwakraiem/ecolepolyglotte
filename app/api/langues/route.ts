import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Langue from "@/models/Langue"
import { verifyToken } from "@/lib/jwt"

// Middleware admin
const isAdmin = (token?: string) => {
  if (!token) return false
  const decoded = verifyToken(token)
  return decoded?.role === "ADMIN"
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const langues = await Langue.find().sort({ createdAt: -1 })
    return NextResponse.json({ langues }, { status: 200 })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ message: error.message || "Failed to fetch langues" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
     const token =
      req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")
    if (!isAdmin(token)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { name, description, flag, discount } = await req.json()

    if (!name ) {
      return NextResponse.json({ message: "Name  are required" }, { status: 400 })
    }

    const langue = new Langue({ name, description, flag, discount })
    await langue.save()

    return NextResponse.json({ message: "Langue created", langue }, { status: 201 })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ message: error.message || "Failed to create langue" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect()
    const token =
 req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")
    if (!isAdmin(token)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id, name, description,flag, discount } = await req.json()
    if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 })

    const langue = await Langue.findByIdAndUpdate(
      id,
      { name, description,flag , discount },
      { new: true, runValidators: true }
    )

    if (!langue) return NextResponse.json({ message: "Langue not found" }, { status: 404 })

    return NextResponse.json({ message: "Langue updated", langue }, { status: 200 })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ message: error.message || "Failed to update langue" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect()
    const token =
 req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")
    if (!isAdmin(token)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 })

    const deleted = await Langue.findByIdAndDelete(id)
    if (!deleted) return NextResponse.json({ message: "Langue not found" }, { status: 404 })

    return NextResponse.json({ message: "Langue deleted" }, { status: 200 })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ message: error.message || "Failed to delete langue" }, { status: 500 })
  }
}
