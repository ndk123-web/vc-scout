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
  
  // Fetch data
  const { data: companiesResponse, loading: companiesLoading } = useFetch<any>('/api/companies?limit=5')
  const { data: listsResponse, loading: listsLoading } = useFetch<any>('/api/lists?limit=5')

  const companies = companiesResponse?.data || []
  const lists = Array.isArray(listsResponse) ? listsResponse : (listsResponse?.data || [])

  // Calculate quick stats (mocked for now, but could be real)
  const totalCompanies = companiesResponse?.pagination?.total || companies.length || 0
  const activeLists = lists.length || 0
  const enrichedCount = companies.filter((c: any) => c.status === 'enriched').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
             Overview of your deal flow and scouting activities.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <button 
            onClick={() => setIsCreateListOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            Create List
          </button>
          <button 
            onClick={() => setIsAddCompanyOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            Add Company
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Pipeline</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{companiesLoading ? '-' : totalCompanies}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Active Lists</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{listsLoading ? '-' : activeLists}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Enriched Companies</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{companiesLoading ? '-' : enrichedCount}</dd>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Companies Panel */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Recent Companies</h2>
            <Link href="/companies" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all
            </Link>
          </div>
          
          <div className="divide-y divide-gray-100">
            {companiesLoading ? (
              <div className="p-6 space-y-4">
                 {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse"></div>)}
              </div>
            ) : companies && companies.length > 0 ? (
              companies.map((company: any) => (
                <div key={company._id} className="p-4 hover:bg-gray-50 transition flex justify-between items-center group">
                  <Link href={`/companies/${company._id}`} className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 transition">{company.name}</p>
                      <p className="text-xs text-gray-500">{company.website}</p>
                    </div>
                    <div className="flex items-center">
                       <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        company.status === 'enriched' ? 'bg-green-100 text-green-800' : 
                        company.status === 'enriching' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {company.status}
                      </span>
                      <svg className="h-5 w-5 text-gray-300 ml-4 group-hover:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No companies yet.
              </div>
            )}
          </div>
          {companies && companies.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <Link href="/companies" className="text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                See full pipeline &rarr;
              </Link>
            </div>
          )}
        </section>

        {/* Lists Panel */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Your Lists</h2>
            <Link href="/lists" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Manage lists
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {listsLoading ? (
               <div className="p-6 space-y-4">
                 {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse"></div>)}
              </div>
            ) : lists && lists.length > 0 ? (
              lists.map((list: any) => (
                <div key={list._id} className="p-4 hover:bg-gray-50 transition group">
                   <Link href={`/lists/${list._id}`} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                        📋
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-purple-600 transition">{list.name}</p>
                        <p className="text-xs text-gray-500">{list.companyIds?.length || 0} companies included</p>
                      </div>
                    </div>
                     <svg className="h-5 w-5 text-gray-300 group-hover:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                   </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                 <p className="text-gray-500 mb-2">No custom lists yet</p>
              </div>
            )}
          </div>
        </section>
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
