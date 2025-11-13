"use client"

import { useState, useCallback } from "react"

export function useApi<T>(apiFunction: (...args: any[]) => Promise<any>, initialData?: T) {
  const [data, setData] = useState<T | null>(initialData || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true)
      setError(null)
      try {
        const result = await apiFunction(...args)
        setData(result.data || result)
        return result
      } catch (err: any) {
        const errorMessage = err.message || "An error occurred"
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [apiFunction],
  )

  return { data, loading, error, execute }
}
