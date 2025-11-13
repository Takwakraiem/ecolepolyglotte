import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Resource from "@/models/Resource";
import { v2 as cloudinary } from "cloudinary";
import { verifyToken } from "@/lib/jwt";

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const {id} = await params;
    const token =
 req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "ADMIN")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });



    const resource = await Resource.findById(id);
    if (!resource)
      return NextResponse.json({ message: "Resource not found" }, { status: 404 });

    // Optionnel : Supprimer le fichier de Cloudinary
    const publicId = resource.url
      .split("/")
      .pop()!
      .split(".")[0]; // récupère le nom sans extension
    await cloudinary.uploader.destroy(`courses/${publicId}`, {
      resource_type: resource.type === "video" ? "video" : "image",
    });

    await Resource.findByIdAndDelete(id);

    return NextResponse.json({ message: "Resource deleted successfully" });
  } catch (error: any) {
    console.error("Delete resource error:", error);
    return NextResponse.json({ message: error.message || "Failed to delete resource" }, { status: 500 });
  }
}
