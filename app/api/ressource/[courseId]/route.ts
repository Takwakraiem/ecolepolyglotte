import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Resource from "@/models/Resource";

export async function GET(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    await dbConnect();
    const { courseId } = await params;

    const resources = await Resource.find({ course: courseId }).sort({ createdAt: -1 });

    return NextResponse.json({ resources });
  } catch (error: any) {
    console.error("Get resources error:", error);
    return NextResponse.json({ message: error.message || "Failed to get resources" }, { status: 500 });
  }
}
