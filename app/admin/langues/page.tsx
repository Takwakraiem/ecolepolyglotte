"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Trash, Edit, Plus, X, ArrowLeft, Crown, BookOpen, MessageSquare } from "lucide-react"
import Link from "next/link"

interface Langue {
  _id: string
  name: string
  description?: string
  flag?: string
  discount?: number
}

export default function AdminLangues() {
  const [langues, setLangues] = useState<Langue[]>([])
  const [loading, setLoading] = useState(true)
  const [formVisible, setFormVisible] = useState(false)
  const [form, setForm] = useState<Partial<Langue>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchLangues = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/langues")
      const data = await res.json()
      setLangues(data.langues)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLangues()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value
    if (e.target.name === "name" && value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1)
    }
    setForm({ ...form, [e.target.name]: value })
  }

  const openForm = (langue?: Langue) => {
    if (langue) {
      setForm(langue)
      setEditingId(langue._id)
    } else {
      setForm({})
      setEditingId(null)
    }
    setFormVisible(true)
  }

  const closeForm = () => {
    setForm({})
    setEditingId(null)
    setFormVisible(false)
  }

  const handleSubmit = async () => {
    try {
      setSaving(true)
      const method = editingId ? "PUT" : "POST"
      const url = "/api/langues"
      const body = editingId ? { ...form, id: editingId } : form
      const token = localStorage.getItem("token")
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials:"include",
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error("Erreur lors de l'enregistrement")
      closeForm()
      fetchLangues()
    } catch (err) {
      console.error(err)
      alert("Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette langue ?")) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/langues?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      })
      if (!res.ok) throw new Error("Erreur lors de la suppression")
      fetchLangues()
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la suppression")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <img src="/logo.png" alt="Logo EcoleLangues" className="w-full h-full object-contain" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Polyglotte formation
              </span>
              <Badge className="ml-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 flex items-center">
                <Crown className="h-3 w-3 mr-1" />
                Super Admin
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/admin/messages" className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                Messages
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Title + Add Button */}
        <div className="flex justify-between items-center">
          <Link href="/admin/dashboard" className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour au dashboard
          </Link>
          <h1 className="text-3xl font-bold">Gestion des Langues</h1>
          <Button onClick={() => openForm()} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </Button>
        </div>

        {/* Formulaire flottant */}
        {formVisible && (
          <Card className="p-6 bg-white shadow-md animate-fadeIn relative">
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-xl font-semibold">{editingId ? "Modifier" : "Ajouter"} une langue</CardTitle>
              <Button variant="outline" size="sm" onClick={closeForm}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Nom" name="name" value={form.name || ""} onChange={handleChange} />
              <Input placeholder="Description" name="description" value={form.description || ""} onChange={handleChange} />
              <Input placeholder="Flag URL / Emoji" name="flag" value={form.flag || ""} onChange={handleChange} />
              <Input placeholder="Remise (%)" type="number" name="discount" value={form.discount || ""} onChange={handleChange} />
            </CardContent>
            <div className="flex space-x-2 mt-4">
              <Button onClick={handleSubmit} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                {saving ? "Enregistrement..." : editingId ? "Modifier" : "Ajouter"}
              </Button>
              <Button variant="outline" onClick={closeForm}>Annuler</Button>
            </div>
          </Card>
        )}

        {/* Tableau interactif */}
        <Card className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nom</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Flag</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Remise</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center">
                    <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto"></div>
                  </td>
                </tr>
              ) : (
                langues.map((l) => (
                  <tr key={l._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2">{l.name}</td>
                    <td className="px-4 py-2">{l.description}</td>
                    <td className="px-4 py-2">
                      {l.flag && (l.flag.startsWith("http") ? (
                        <img src={l.flag} alt="flag" className="w-6 h-6 rounded" />
                      ) : (
                        <span className="text-2xl">{l.flag}</span>
                      ))}
                    </td>
                    <td className="px-4 py-2">
                      {l.discount ? <Badge className="bg-green-100 text-green-800">{l.discount}%</Badge> : "-"}
                    </td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openForm(l)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(l._id)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
