'use client'

import { useFetch } from '@/lib/hooks'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AddCompanyToListModal from '@/components/AddCompanyToListModal'

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
      reason?: string
    }
  }
}

interface List {
  _id: string
  name: string
  description?: string
  companyIds: Company[]
  owner?: string
  thesis?: {
    industries?: string[]
    stages?: string[]
    regions?: string[]
  }
}

export default function ListDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [actionLoading, setActionLoading] = useState(false)
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false)
  const { data: list, loading, error, refetch } = useFetch<List>(
    `/api/lists/${params.id}`
  )

  const handleDeleteList = async () => {
    if (!confirm('Are you sure you want to delete this list?')) return

    setActionLoading(true)
    try {
      const res = await fetch(`/api/lists/${params.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/lists')
      } else {
        alert('Failed to delete list')
      }
    } catch (err) {
      alert('Error deleting list')
    } finally {
      setActionLoading(false)
    }
  }

  const handleExportCSV = () => {
    if (!list) return
    const companies = Array.isArray(list.companyIds) ? list.companyIds : Object.values(list.companyIds || {})
     if (!companies.length) {
       alert('No companies to export')
       return
     }
     
     const headers = ['Name', 'Website', 'Stage', 'Location', 'Score', 'Industry', 'Summary']
     const rows = companies.map((c: any) => [
       c.name,
       c.website,
       c.stage || '',
       c.location || '',
       c.signals?.thesisFit?.score || '',
       (c.industry || []).join('; '),
       c.enrichedData?.summary || ''
     ])
     
     const csvContent = [
       headers.join(','),
       ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
     ].join('\n')
     
     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
     const url = URL.createObjectURL(blob)
     const link = document.createElement('a')
     link.href = url
     link.setAttribute('download', `${list.name.replace(/\s+/g, '_')}_export.csv`)
     document.body.appendChild(link)
     link.click()
     document.body.removeChild(link)
  }

  const handleEditList = () => {
    // For now, redirect to a hypothetical edit page or just alert
    // Ideally we opens a modal similar to CreateListModal but pre-filled
    const newName = prompt('Enter new list name:', list?.name)
    if (newName && newName !== list?.name) {
       // logic to update name
       fetch(`/api/lists/${params.id}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name: newName }) 
       }).then(res => {
         if(res.ok) window.location.reload()
       })
    }
  }

  if (error) {
    return (
      <div>
        <Link
          href="/lists"
          className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block"
        >
          ← Back to Lists
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          Error loading list: {error}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <Link
          href="/lists"
          className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block"
        >
          ← Back to Lists
        </Link>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">Loading list details...</p>
        </div>
      </div>
    )
  }

  if (!list) {
    return (
      <div>
        <Link
          href="/lists"
          className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block"
        >
          ← Back to Lists
        </Link>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">List not found</p>
        </div>
      </div>
    )
  }

  const companies: any[] = Array.isArray(list.companyIds)
    ? list.companyIds
    : Object.values(list.companyIds || {})

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/lists"
          className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block"
        >
          ← Back to Lists
        </Link>
        <h1 className="text-4xl font-bold text-gray-900">{list.name}</h1>
        {list.description && (
          <p className="text-gray-600 mt-2 text-lg">{list.description}</p>
        )}
      </div>

      {/* Thesis Details */}
      {list.thesis && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Thesis Definition
          </h2>

          <div className="grid grid-cols-3 gap-6">
            {list.thesis.industries && list.thesis.industries.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase mb-3">
                  Industries
                </p>
                <div className="flex flex-wrap gap-2">
                  {list.thesis.industries.map((ind) => (
                    <span
                      key={ind}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {list.thesis.stages && list.thesis.stages.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase mb-3">
                  Stages
                </p>
                <div className="flex flex-wrap gap-2">
                  {list.thesis.stages.map((stage) => (
                    <span
                      key={stage}
                      className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {list.thesis.regions && list.thesis.regions.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase mb-3">
                  Regions
                </p>
                <div className="flex flex-wrap gap-2">
                  {list.thesis.regions.map((region) => (
                    <span
                      key={region}
                      className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Companies in List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Companies ({companies.length})
          </h2>
          <button 
            onClick={() => setIsAddCompanyOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            + Add Company
          </button>
        </div>

        {companies.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No companies in this list yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add companies that match your thesis definition.
            </p>
            <button 
              onClick={() => setIsAddCompanyOpen(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Add Your First Company
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {companies.map((company) => (
              <Link
                key={company._id}
                href={`/companies/${company._id}`}
                className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {company.name}
                    </h3>
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
                        {company.industry.map((ind : any) => (
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
                      {company.signals.thesisFit.reason && (
                        <p className="text-xs text-gray-600 mt-2 max-w-xs">
                          {company.signals.thesisFit.reason}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* List Actions */}
      <div className="mt-12 flex gap-4 justify-center">
        <button 
          onClick={handleEditList}
          className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Edit List
        </button>
        <button 
          onClick={() => {
            const rows = companies.map((c: any) => [
              c.name,
              c.website,
              c.stage || '',
              c.location || '',
              c.signals?.thesisFit?.score || '',
              (c.industry || []).join('; '),
              c.enrichedData?.summary || ''
            ])
            const headers = ['Name', 'Website', 'Stage', 'Location', 'Score', 'Industry', 'Summary']
            const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(','))].join('\n')
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${list.name.replace(/\s+/g, '_')}_export.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }}
          className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Export as CSV
        </button>
        <button 
          onClick={handleDeleteList}
          className="px-6 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition"
        >
          {actionLoading ? 'Deleting...' : 'Delete List'}
        </button>
      </div>
      
      {isAddCompanyOpen && (
        <AddCompanyToListModal
          isOpen={isAddCompanyOpen}
          listId={params.id}
          onClose={() => setIsAddCompanyOpen(false)}
          onSuccess={() => {
            if (refetch) refetch()
          }}
        />
      )}
    </div>
  )
}
