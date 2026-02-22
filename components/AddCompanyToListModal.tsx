'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AddCompanyToListModal({
  isOpen,
  onClose,
  listId,
  onSuccess
}: {
  isOpen: boolean
  onClose: () => void
  listId: string
  onSuccess?: () => void
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'create' | 'search'>('create')
  
  // Create State
  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  // Search Effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setSearching(true)
        try {
          const res = await fetch(`/api/companies?search=${searchQuery}&limit=5`)
          const json = await res.json()
          setSearchResults(json.data || [])
        } catch (e) {
          console.error(e)
        } finally {
          setSearching(false)
        }
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Create Company
      const createRes = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, website }),
      })

      if (!createRes.ok) {
        const json = await createRes.json()
        throw new Error(json.error || 'Failed to create company')
      }

      const { data: newCompany } = await createRes.json()

      // 2. Add to List
      await addCompanyToList(newCompany._id)

    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const addCompanyToList = async (companyId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/lists/${listId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addCompanyId: companyId }),
      })

      if (!res.ok) throw new Error('Failed to add company to list')

      if (onSuccess) onSuccess()
      onClose()
      // Reset form
      setName('')
      setWebsite('')
      setSearchQuery('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Add Company to List</h2>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`flex-1 pb-2 text-sm font-medium ${
              activeTab === 'create'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('create')}
          >
            Create New
          </button>
          <button
            className={`flex-1 pb-2 text-sm font-medium ${
              activeTab === 'search'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('search')}
          >
            Search Existing
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded">
            {error}
          </div>
        )}

        {activeTab === 'create' ? (
          <form onSubmit={handleCreateSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. OpenAI"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <input
                type="url"
                required
                className="w-full px-3 py-2 border rounded-lg"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://openai.com"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create & Add'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg mb-4"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <div className="max-h-60 overflow-y-auto space-y-2">
              {searching ? (
                <p className="text-gray-500 text-sm text-center">Searching...</p>
              ) : searchResults.length > 0 ? (
                searchResults.map(company => (
                  <div key={company._id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border border-gray-100">
                    <div>
                      <p className="font-medium text-sm">{company.name}</p>
                      <p className="text-xs text-gray-500">{company.website}</p>
                    </div>
                    <button
                      onClick={() => addCompanyToList(company._id)}
                      disabled={loading}
                      className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
                    >
                      Add
                    </button>
                  </div>
                ))
              ) : searchQuery.length > 2 ? (
                <p className="text-gray-500 text-sm text-center">No companies found</p>
              ) : (
                <p className="text-gray-400 text-sm text-center">Type to search existing companies</p>
              )}
            </div>
             <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}