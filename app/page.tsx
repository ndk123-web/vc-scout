'use client'

import { useState } from 'react'
import { useFetch } from '@/lib/hooks'
import Link from 'next/link'
import AddCompanyModal from '@/components/AddCompanyModal'
import CreateListModal from '@/components/CreateListModal'

interface Company {
  _id: string
  name: string
  website: string
  status: string
  updatedAt: string
}

interface List {
  _id: string
  name: string
  companyIds: any[]
  updatedAt: string
}

export default function Home() {
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false)
  const [isCreateListOpen, setIsCreateListOpen] = useState(false)
  
  // Fetch recent data to make dashboard alive
  // The API returns { data: [...], pagination: ... } so we need to correct the type
  const { data: companiesResponse, loading: companiesLoading } = useFetch<any>('/api/companies?limit=5')
  const { data: listsResponse, loading: listsLoading } = useFetch<any>('/api/lists?limit=5')

  const companies = companiesResponse?.data || []
  // Handle case where useFetch returns array directly (no pagination) or object with data property
  const lists = Array.isArray(listsResponse) ? listsResponse : (listsResponse?.data || [])

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to VCscout
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            Your AI-powered deal flow engine
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsCreateListOpen(true)}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            + New List
          </button>
          <button 
            onClick={() => setIsAddCompanyOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
          >
            + Add Company
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Recent Companies */}
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🚀 Recent Companies
          </h2>
          
          {companiesLoading ? (
            <div className="space-y-3">
               {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>)}
            </div>
          ) : companies && companies.length > 0 ? (
            <div className="space-y-3">
              {companies.map((company: any) => (
                <Link 
                  key={company._id} 
                  href={`/companies/${company._id}`} 
                  className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm hover:border-blue-300 transition group"
                >
                  <div>
                    <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition">{company.name}</span>
                    <span className="text-xs text-gray-500 block truncate max-w-[200px]">{company.website}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      company.status === 'enriched' ? 'bg-green-100 text-green-700' : 
                      company.status === 'enriching' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {company.status}
                    </span>
                    <span className="text-gray-300 group-hover:text-blue-400">→</span>
                  </div>
                </Link>
              ))}
              <Link href="/companies" className="block text-center text-sm text-blue-600 font-medium mt-4 hover:underline">
                View all companies →
              </Link>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 mb-2">No companies found</p>
              <button 
                onClick={() => setIsAddCompanyOpen(true)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Add your first company
              </button>
            </div>
          )}
        </div>

        {/* My Lists */}
        <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            📋 My Lists
          </h2>

          {listsLoading ? (
             <div className="space-y-3">
               {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>)}
            </div>
          ) : lists && lists.length > 0 ? (
            <div className="space-y-3">
              {lists.map((list: any) => (
                <Link 
                  key={list._id} 
                  href={`/lists/${list._id}`} 
                  className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm hover:border-purple-300 transition group"
                >
                  <div>
                    <span className="font-semibold text-gray-900 group-hover:text-purple-600 transition">{list.name}</span>
                    <span className="text-xs text-gray-500 block">
                      {list.companyIds?.length || 0} companies
                    </span>
                  </div>
                  <span className="text-gray-300 group-hover:text-purple-400">→</span>
                </Link>
              ))}
               <Link href="/lists" className="block text-center text-sm text-purple-600 font-medium mt-4 hover:underline">
                View all lists →
              </Link>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 mb-2">No lists created</p>
              <button 
                onClick={() => setIsCreateListOpen(true)}
                className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline"
              >
                Create your first list
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border boundary-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">
          💡 Pro Tip: Isolate Your Workflow
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Enable multi-user mode to keep your lists and notes private. Currently running in 
          <span className="font-medium bg-gray-100 px-2 py-0.5 rounded ml-1">Team Mode</span> (shared workspace).
        </p>
      </div>

      {isAddCompanyOpen && (
        <AddCompanyModal isOpen={isAddCompanyOpen} onClose={() => setIsAddCompanyOpen(false)} />
      )}
      {isCreateListOpen && (
        <CreateListModal isOpen={isCreateListOpen} onClose={() => setIsCreateListOpen(false)} />
      )}
    </div>
  )
}
