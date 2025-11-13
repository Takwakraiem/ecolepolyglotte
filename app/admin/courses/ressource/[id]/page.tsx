"use client";

import CourseResources from "@/components/CourseResources";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="flex items-center">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
            <img
              src="/logo.png" // <-- Place your image in /public/logo.png
              alt="Logo EcoleLangues"
              style={{ width: '50px',height:'50px' }}
              className="w-full h-full object-contain"
            />
          </div>
                <span className="ml-2 text-xl font-bold text-gray-900">Polyglotte formation</span>
              </Link>
              <Badge variant="secondary" className="ml-3">
                Admin
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Bouton Retour */}
        <Link
          href="/admin/courses"
          className="inline-flex items-center px-4 py-2 mb-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux cours
        </Link>

        <CourseResources courseId={courseId as string} />
      </main>
    </div>
  );
}
