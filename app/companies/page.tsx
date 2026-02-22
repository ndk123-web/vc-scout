'use client'

import { useFetch } from '@/lib/hooks'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import AddCompanyModal from '@/components/AddCompanyModal'

interface Company {
  _id: string
  name: string
  website: string
  industry: string[]
  stage?: string
  location?: string
  enrichedData?: {
    summary?: string
  }
  signals?: {
    thesisFit?: {
      score?: number
    }
  }
  status: string
}

interface CompaniesResponse {
  data: Company[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function CompaniesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedStage, setSelectedStage] = useState('All Stages')
  const [limit, setLimit] = useState(10)
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to page 1 on search
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const { data: response, loading, error, refetch } =
    useFetch<CompaniesResponse>(
      `/api/companies?page=${page}&limit=${limit}&search=${debouncedSearch}&stage=${selectedStage === 'All Stages' ? '' : selectedStage}`
    )

  const companies = response?.data || []
  const pagination = response?.pagination

  const handleCompanyAdded = () => {
    setIsAddCompanyOpen(false)
    if (refetch) refetch()
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Companies</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          Error loading companies: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">
            Manage and view all companies in your pipeline
          </p>
        </div>
        <button 
          onClick={() => setIsAddCompanyOpen(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + Add Company
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select 
          value={selectedStage}
          onChange={(e) => {
            setSelectedStage(e.target.value)
            setPage(1)
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All Stages</option>
          <option>Seed</option>
          <option>Series A</option>
          <option>Series B</option>
          <option>Series C</option>
          <option>Series D</option>
          <option>Growth</option>
          <option>Late Stage</option>
        </select>
        
        <select 
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value))
            setPage(1)
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">Loading companies...</p>
        </div>
      ) : !companies || companies.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No companies found
          </h2>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or filters, or add a new company.
          </p>
          <button 
            onClick={() => setIsAddCompanyOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Add Company
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {companies.map((company) => (
              <Link
                key={company._id}
                href={`/companies/${company._id}`}
                className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {company.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {company.website}
                    </p>

                    <div className="flex gap-4 mt-3 text-sm">
                      {company.stage && (
                        <div>
                          <span className="text-gray-500 font-medium">
                            Stage:{' '}
                          </span>
                          <span className="text-gray-700">{company.stage}</span>
                        </div>
                      )}
                      {company.location && (
                        <div>
                          <span className="text-gray-500 font-medium">
                            Location:{' '}
                          </span>
                          <span className="text-gray-700">
                            {company.location}
                          </span>
                        </div>
                      )}
                    </div>

                    {company.industry && company.industry.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {company.industry.map((ind: string) => (
                          <span
                            key={ind}
                            className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-medium"
                          >
                            {ind}
                          </span>
                        ))}
                      </div>
                    )}

                    {company.enrichedData?.summary && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                        {company.enrichedData.summary}
                      </p>
                    )}
                  </div>

                  {company.signals?.thesisFit?.score && (
                    <div className="ml-6 text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {company.signals.thesisFit.score}/10
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Thesis Fit</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              <div className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </div>

              <button
                disabled={page === pagination.pages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      
      {isAddCompanyOpen && (
        <AddCompanyModal 
          isOpen={isAddCompanyOpen} 
          onClose={handleCompanyAdded} 
        />
      )}
    </div>
  )
}
