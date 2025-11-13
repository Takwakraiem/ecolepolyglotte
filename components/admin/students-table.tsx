"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"

interface Student {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  language?: string
  currentLevel?: string
  isActive: boolean
  createdAt: string
}

interface StudentsTableProps {
  students: Student[]
  onStudentDeleted: (id: string) => void
}

export function StudentsTable({ students, onStudentDeleted }: StudentsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // ✅ Gère la suppression d’un étudiant
  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await api.deleteStudent(id)
      onStudentDeleted(id)
    } catch (err: any) {
      console.error("Erreur lors de la suppression :", err.message)
    } finally {
      setDeletingId(null)
    }
  }

  // ✅ Ouvre la boîte de dialogue
  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student)
    setDeleteDialogOpen(true)
  }

  // ✅ Confirme la suppression
  const handleConfirmDelete = async () => {
    if (!selectedStudent) return

    setIsDeleting(true)
    try {
      await api.deleteStudent(selectedStudent._id)
      onStudentDeleted(selectedStudent._id)
      setDeleteDialogOpen(false)
      setSelectedStudent(null)
    } catch (error) {
      console.error("Failed to delete student:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800">Actif</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Inactif</Badge>
    )
  }

  const getLevelBadge = (level?: string) => {
    if (!level) return null
    const colors: Record<string, string> = {
      A1: "bg-yellow-100 text-yellow-800",
      A2: "bg-yellow-100 text-yellow-800",
      B1: "bg-orange-100 text-orange-800",
      B2: "bg-orange-100 text-orange-800",
      C1: "bg-red-100 text-red-800",
      C2: "bg-red-100 text-red-800",
    }
    return <Badge className={colors[level] || "bg-gray-100 text-gray-800"}>{level}</Badge>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Étudiant</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Formation</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Inscription</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.map((student) => (
            <TableRow key={student._id}>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {student.firstName} {student.lastName}
                  </div>
                  <div className="text-sm text-gray-500">ID: {student._id}</div>
                </div>
              </TableCell>

              <TableCell>
                <div>
                  <div className="text-sm">{student.email}</div>
                  <div className="text-sm text-gray-500">{student.phone || "N/A"}</div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{student.language || "N/A"}</span>
                  {student.currentLevel && getLevelBadge(student.currentLevel)}
                </div>
              </TableCell>

              <TableCell>{getStatusBadge(student.isActive)}</TableCell>

              <TableCell>
                <div className="text-sm text-gray-600">
                  {new Date(student.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/students/${student._id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir détails
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href={`/admin/students/${student._id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={() => handleDeleteClick(student)}
                            className="w-full text-left text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4 inline" />
                            Supprimer
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogTitle>Supprimer l'étudiant</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible.
                          </AlertDialogDescription>
                          <div className="flex space-x-3">
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(student._id)}
                              disabled={deletingId === student._id}
                              className="bg-red-600"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ✅ Dialogue global de confirmation */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title="Supprimer l'étudiant"
        description={`Êtes-vous sûr de vouloir supprimer ${selectedStudent?.firstName} ${selectedStudent?.lastName} ? Cette action est irréversible.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setSelectedStudent(null)
        }}
        isLoading={isDeleting}
      />
    </>
  )
}
