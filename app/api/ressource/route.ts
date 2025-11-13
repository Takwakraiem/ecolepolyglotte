import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { dbConnect } from "@/lib/db";
import Resource from "@/models/Resource";
import { verifyToken } from "@/lib/jwt";

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const token =
 req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "ADMIN")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const formData = await req.formData();
    const courseId = formData.get("courseId")?.toString();
    if (!courseId) return NextResponse.json({ message: "Course ID is required" }, { status: 400 });

    const files = formData.getAll("files"); // multiple files
    if (!files || files.length === 0)
      return NextResponse.json({ message: "No files uploaded" }, { status: 400 });

    const uploadedResources = [];

    for (const file of files as any[]) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split(".").pop()?.toLowerCase();

      let resourceType: "image" | "video" | "pdf" = "pdf";
      if (["jpg", "jpeg", "png", "gif"].includes(ext!)) resourceType = "image";
      else if (["mp4", "mov", "avi"].includes(ext!)) resourceType = "video";

      const result = await cloudinary.uploader.upload_stream(
        { resource_type: resourceType === "video" ? "video" : "auto", folder: "courses" },
        async (error, result) => {
          if (error) throw error;
          return result;
        },
      );

      // Simple version: upload via buffer using a promise
      const uploadPromise = new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: resourceType === "video" ? "video" : "auto", folder: "courses" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      const uploadResult = await uploadPromise;


      const resource = new Resource({
        course: courseId,
        type: resourceType,
        url: uploadResult.secure_url,
        filename: file.name,
      });

      await resource.save();
      uploadedResources.push(resource);
    }

    return NextResponse.json({ message: "Resources uploaded", resources: uploadedResources }, { status: 201 });
  } catch (error: any) {
    console.error("Upload resource error:", error);
    return NextResponse.json({ message: error.message || "Failed to upload resources" }, { status: 500 });
  }
}
