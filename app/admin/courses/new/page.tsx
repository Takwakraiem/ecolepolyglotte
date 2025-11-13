"use client";

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

interface ScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
}

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  //const [schedule, setSchedule] = useState<ScheduleItem[]>([{ day: "", startTime: "", endTime: "" }]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "Anglais",
    level: "A1",
    teacher: "",
    maxStudents: 20,
    startDate: "",
    endDate: "",
  });


  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const response = await api.getTeachers();
        setTeachers(response.teachers || []);
      } catch (error) {
        console.error("Failed to load teachers:", error);
      }
    };
    loadTeachers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:  name === "maxStudents" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createCourse(formData);
      router.push("/admin/courses");
    } catch (error) {
      console.error("Failed to create course:", error);
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
        <Link href="/admin/courses" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux cours
        </Link>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Créer un nouveau cours</CardTitle>
            <CardDescription>Remplissez le formulaire pour créer une nouvelle formation</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Titre */}
              <div>
                <Label htmlFor="title">Titre du cours</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-2"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                />
              </div>

              {/* Langue et Niveau */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Langue</Label>
                  <Select value={formData.language} onValueChange={(value) => handleSelectChange("language", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Anglais">Anglais</SelectItem>
                      <SelectItem value="Espagnol">Espagnol</SelectItem>
                      <SelectItem value="Allemand">Allemand</SelectItem>
                      <SelectItem value="Italien">Italien</SelectItem>
                      <SelectItem value="Portugais">Portugais</SelectItem>
                      <SelectItem value="Chinois">Chinois</SelectItem>
                      <SelectItem value="Japonais">Japonais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="level">Niveau</Label>
                  <Select value={formData.level} onValueChange={(value) => handleSelectChange("level", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A1">A1 - Débutant</SelectItem>
                      <SelectItem value="A2">A2 - Élémentaire</SelectItem>
                      <SelectItem value="B1">B1 - Intermédiaire</SelectItem>
                      <SelectItem value="B2">B2 - Intermédiaire supérieur</SelectItem>
                      <SelectItem value="C1">C1 - Avancé</SelectItem>
                      <SelectItem value="C2">C2 - Maîtrise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Formateur */}
              <div>
                <Label htmlFor="teacher">Formateur</Label>
                <Select value={formData.teacher} onValueChange={(value) => handleSelectChange("teacher", value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Sélectionner un formateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher._id} value={teacher._id}>
                        {teacher.firstName} {teacher.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dates, max étudiants, prix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Date de début</Label>
                  <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="endDate">Date de fin</Label>
                  <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} className="mt-2" />
                </div>

              </div>

              {/* Nombre max étudiants */}
              <div>
                <Label htmlFor="maxStudents">Nombre maximum d'étudiants</Label>
                <Input id="maxStudents" name="maxStudents" type="number" value={formData.maxStudents} onChange={handleChange} className="mt-2" />
              </div>

              {/* Planning */}
              {/* <div>
                <Label>Planning</Label>
                {schedule.map((s, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input placeholder="Jour" value={s.day} onChange={(e) => handleScheduleChange(index, "day", e.target.value)} required />
                    <Input type="time" value={s.startTime} onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)} required />
                    <Input type="time" value={s.endTime} onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)} required />
                    <Button type="button" variant="destructive" onClick={() => handleRemoveSchedule(index)}>Supprimer</Button>
                  </div>
                ))}
                <Button type="button" onClick={handleAddSchedule}>Ajouter un créneau</Button>
              </div> */}

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Création..." : "Créer le cours"}
                </Button>
                <Link href="/admin/courses" className="flex-1">
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
