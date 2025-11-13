"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Failed to load user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await api.login(email, password)
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
      setUser(response.user)
      return response
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (data: any) => {
    setLoading(true)
    try {
      const response = await api.register(data)
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
      setUser(response.user)
      return response
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }, [router])

  return { user, loading, login, register, logout }
}
