'use client'

import { useFetch } from '@/lib/hooks'
import Link from 'next/link'
import { useState } from 'react'
import CreateListModal from '@/components/CreateListModal'

interface List {
  _id: string
  name: string
  description?: string
  companyIds: any[]
  thesis?: {
    industries?: string[]
    stages?: string[]
    regions?: string[]
  }
}

export default function ListsPage() {
  const { data: lists, loading, error } = useFetch<List[]>('/api/lists')
  const [isCreateListOpen, setIsCreateListOpen] = useState(false)

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lists</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          Error loading lists: {error}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lists</h1>
          <p className="text-gray-600 mt-1">
            Organize companies by thesis, stage, or custom categories
          </p>
        </div>
        <button 
          onClick={() => setIsCreateListOpen(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + New List
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading lists...</p>
        </div>
      ) : !lists || lists.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No lists yet
          </h2>
          <p className="text-gray-600 mb-6">
            Create your first list to organize companies by thesis or category.
          </p>
          <button 
            onClick={() => setIsCreateListOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Create Your First List
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {lists.map((list) => (
            <div
              key={list._id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {list.name}
              </h2>
              {list.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {list.description}
                </p>
              )}
              <p className="text-gray-500 text-sm mb-4">
                {Array.isArray(list.companyIds) ? list.companyIds.length : 0} compan
                {Array.isArray(list.companyIds) && list.companyIds.length === 1 ? 'y' : 'ies'}
              </p>

              {list.thesis && (
                <div className="mb-4 text-xs space-y-2">
                  {list.thesis.industries && list.thesis.industries.length > 0 && (
                    <div>
                      <p className="text-gray-500 font-medium">Industries</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {list.thesis.industries.map((ind) => (
                          <span
                            key={ind}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                          >
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {list.thesis.stages && list.thesis.stages.length > 0 && (
                    <div>
                      <p className="text-gray-500 font-medium">Stages</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {list.thesis.stages.map((stage) => (
                          <span
                            key={stage}
                            className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs"
                          >
                            {stage}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Link
                href={`/lists/${list._id}`}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-block"
              >
                View List →
              </Link>
            </div>
          ))}
        </div>
      )}

      {isCreateListOpen && (
        <CreateListModal isOpen={isCreateListOpen} onClose={() => setIsCreateListOpen(false)} />
      )}
    </div>
  )
}
