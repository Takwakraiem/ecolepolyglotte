"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";

export default function NewSchedulePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    course: "",
    startTime: "09:00",
    endTime: "10:30",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await api.getCourses();
        setCourses(response.courses || []);
        toast({
          title: "Cours chargés",
          description: "La liste des cours a été mise à jour avec succès.",
        });
      } catch (error) {
        console.error("Failed to load courses:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les cours. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    };

    loadCourses();
    window.addEventListener("focus", loadCourses);
    return () => window.removeEventListener("focus", loadCourses);
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Form validation
  const validateForm = () => {
    const missingFields: string[] = [];
    if (!formData.course) missingFields.push("Cours");
    if (!formData.startTime) missingFields.push("Heure de début");
    if (!formData.endTime) missingFields.push("Heure de fin");
    if (!formData.date) missingFields.push("Date");

    if (missingFields.length > 0) {
      toast({
        title: "Champs requis",
        description: `Veuillez remplir : ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return; // stop submission if validation fails

    setLoading(true);
    try {
      await api.createSchedule(formData);
      toast({
        title: "Créneau ajouté",
        description: "Le cours a été programmé avec succès.",
      });
      router.push("/admin/schedule");
      router.refresh();
    } catch (error) {
      console.error("Failed to create schedule:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le créneau. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin/schedule" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au planning
        </Link>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Ajouter un créneau</CardTitle>
            <CardDescription>Programmez un nouveau cours dans l'emploi du temps</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="course">Cours</Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) => handleSelectChange("course", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Sélectionner un cours" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course._id} value={course._id}>
                        {course.title} - {course.level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="startTime">Heure de début</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Heure de fin</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Création..." : "Ajouter le créneau"}
                </Button>
                <Link href="/admin/schedule" className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent">
                    Annuler
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
