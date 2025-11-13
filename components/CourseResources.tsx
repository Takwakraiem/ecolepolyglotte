"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Resource {
  _id: string;
  type: "image" | "video" | "pdf";
  url: string;
  filename: string;
}

interface Props {
  courseId: string;
}

export default function CourseResources({ courseId }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  useEffect(() => {
    if (token) fetchResources();
  }, [courseId]);

  const fetchResources = async () => {
    try {
      const res = await fetch(`/api/ressource/${courseId}`);
      const data = await res.json();
      setResources(data.resources || []);
    } catch (err) {
      console.error(err);
      setResources([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (!files.length) {
      setMessage("Veuillez sélectionner des fichiers");
      return;
    }
    setLoadingUpload(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("courseId", courseId);
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/ressource", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setFiles([]);
        fetchResources();
        setMessage("Fichiers téléchargés avec succès !");
      } else {
        setMessage(data.message || "Échec du téléchargement");
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors du téléchargement");
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoadingDeleteId(id);
    try {
      const res = await fetch(`/api/ressource/remove/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (res.ok) {
        setResources(resources.filter((r) => r._id !== id));
        setMessage("Ressource supprimée");
      } else {
        const data = await res.json();
        setMessage(data.message || "Échec de la suppression");
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la suppression");
    } finally {
      setLoadingDeleteId(null);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 border rounded-xl space-y-6 bg-white shadow-sm">
      <h2 className="text-2xl font-bold">Ressources du cours</h2>

      {message && (
        <Badge variant="secondary" className="px-4 py-2">
          {message}
        </Badge>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="file:border file:border-gray-300 file:px-3 file:py-1 file:rounded file:bg-gray-50 file:text-sm hover:file:bg-gray-100"
        />
        <Button onClick={handleUpload} disabled={loadingUpload}>
          {loadingUpload ? "Téléchargement..." : "Télécharger"}
        </Button>
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {files.map((file) => (
            <Badge key={file.name} variant="outline">
              {file.name}
            </Badge>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {resources.map((res) => (
          <div
            key={res._id}
            className="border rounded-lg relative overflow-hidden shadow-sm"
          >
            {res.type === "image" && (
              <img
                src={res.url}
                alt={res.filename}
                className="w-full h-40 object-cover"
              />
            )}
            {res.type === "video" && (
              <video controls className="w-full h-40">
                <source src={res.url} type="video/mp4" />
              </video>
            )}
            {res.type === "pdf" && (
              <div className="flex flex-col items-center justify-center p-4">
                <span className="text-sm font-medium mb-2">{res.filename}</span>
                <a
                  href={res.url}
                  download={res.filename}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Télécharger
                </a>
              </div>
            )}

            {/* AlertDialog Suppression */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setDeleteId(res._id)}
                  disabled={loadingDeleteId === res._id}
                >
                  {loadingDeleteId === res._id ? "Suppression..." : "Supprimer"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer cette ressource ? Cette action
                  est irréversible.
                </AlertDialogDescription>
                <div className="mt-4 flex justify-end gap-2">
                  <AlertDialogCancel asChild>
                    <Button variant="outline">Annuler</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      variant="destructive"
                      onClick={() => deleteId && handleDelete(deleteId)}
                      disabled={loadingDeleteId === res._id}
                    >
                      {loadingDeleteId === res._id ? "Suppression..." : "Supprimer"}
                    </Button>
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    </div>
  );
}
