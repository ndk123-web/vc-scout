'use client'

import { useState, useEffect } from 'react'

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const json = await response.json()
      // If the response has pagination, return the whole object so we don't lose metadata
      if (json.pagination) {
        setData(json as T)
      } else {
        setData(json.data || json)
      }
      setError(null)
    } catch (err: any) {
      setError(err.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [url])

  return { data, loading, error, refetch: fetchData }
}
