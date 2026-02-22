'use client'

import { useFetch } from '@/lib/hooks'
import Link from 'next/link'
import { useState } from 'react'

interface Company {
  _id: string
  name: string
  website: string
  industry: string[]
  stage?: string
  location?: string
  enrichedData?: {
    summary?: string
    keywords?: string[]
    foundingTeam?: string[]
    problemStatement?: string
    productStage?: string
    explainedSignals?: string
  }
  signals?: {
    momentum?: { value: number; source: string }
    marketSize?: { value: number; description: string }
    thesisFit?: { score: number; reason: string }
  }
  notes?: any[]
  status: string
  lastEnrichedAt?: string
}

export default function CompanyDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { data: company, loading, error, refetch } = useFetch<Company>(
    `/api/companies/${params.id}`
  )
  const { data: notes, loading: notesLoading, refetch: refetchNotes } = useFetch<any[]>(
    `/api/notes?companyId=${params.id}`
  )
  const [noteText, setNoteText] = useState('')
  const [enriching, setEnriching] = useState(false)
  const [enrichError, setEnrichError] = useState<string | null>(null)
  const [savingNote, setSavingNote] = useState(false)

  const handleSaveNote = async () => {
    if (!company || !noteText.trim()) return

    setSavingNote(true)
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: company._id,
          text: noteText,
          author: 'Me', // Todo: Replace with real user
          type: 'research'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save note')
      }

      setNoteText('')
      if (refetchNotes) {
        await refetchNotes()
      }
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Failed to save note')
    } finally {
      setSavingNote(false)
    }
  }

  const handleEnrich = async (useDemo = false) => {
    if (!company) return

    setEnriching(true)
    setEnrichError(null)

    try {
      const endpoint = useDemo ? '/api/enrich-demo' : '/api/enrich'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: company._id,
          website: company.website,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Enrichment failed')
      }

      // Refresh company data
      if (refetch) {
        await refetch()
      }
    } catch (err: any) {
      setEnrichError(err.message)
    } finally {
      setEnriching(false)
    }
  }

  if (error) {
    return (
      <div>
        <Link
          href="/companies"
          className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block"
        >
          ← Back to Companies
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          Error loading company: {error}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <Link
          href="/companies"
          className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block"
        >
          ← Back to Companies
        </Link>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">Loading company details...</p>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div>
        <Link
          href="/companies"
          className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block"
        >
          ← Back to Companies
        </Link>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">Company not found</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/companies" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
          ← Back to Companies
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900">{company.name}</h1>
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
            >
              {company.website}
            </a>
          </div>

          {/* Enrich Button */}
          <div className="text-right">
            {company.status === 'enriched' || company.enrichedData?.summary ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
                <p className="text-xs text-green-700 font-medium mb-1">
                  ✅ Enriched
                </p>
                {company.lastEnrichedAt && (
                  <p className="text-xs text-green-600">
                    {new Date(company.lastEnrichedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
                <p className="text-xs text-yellow-700 font-medium">
                  Not enriched
                </p>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={() => handleEnrich(true)}
                disabled={enriching}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition text-sm"
              >
                {enriching ? '⏳ Enriching...' : '✨ AI Enrich (Demo)'}
              </button>

              <button
                onClick={() => handleEnrich(false)}
                disabled={enriching}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 transition text-sm"
              >
                {enriching ? '⏳ Enriching...' : '🌐 Enrich from Web'}
              </button>
            </div>

            {enrichError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                {enrichError}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 font-medium uppercase mb-2">
            Stage
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {company.stage || 'N/A'}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 font-medium uppercase mb-2">
            Location
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {company.location || 'N/A'}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 font-medium uppercase mb-2">
            Status
          </p>
          <p className="text-lg font-semibold text-blue-600 capitalize">
            {company.status}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 font-medium uppercase mb-2">
            Thesis Fit
          </p>
          <p className="text-3xl font-bold text-blue-600">
            {company.signals?.thesisFit?.score || '-'}/10
          </p>
        </div>
      </div>

      {/* Industries */}
      {company.industry && company.industry.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 uppercase mb-3">
            Industries
          </h2>
          <div className="flex gap-2">
            {company.industry.map((ind) => (
              <span
                key={ind}
                className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Enriched Data */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Summary & Problem */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
          {company.enrichedData?.summary ? (
            <p className="text-gray-600 leading-relaxed">
              {company.enrichedData.summary}
            </p>
          ) : (
            <p className="text-gray-500 italic">No summary available yet</p>
          )}

          {company.enrichedData?.problemStatement && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Problem</h3>
              <p className="text-gray-600">{company.enrichedData.problemStatement}</p>
            </div>
          )}
        </div>

        {/* Signals */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Signals</h2>
          <div className="space-y-4">
            {company.signals?.momentum && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Momentum
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {company.signals.momentum.value}/10
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {company.signals.momentum.source}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(company.signals.momentum.value / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {company.signals?.marketSize && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Market Size
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {company.signals.marketSize.value}/10
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {company.signals.marketSize.description}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(company.signals.marketSize.value / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {company.signals?.thesisFit && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Thesis Fit
                  </span>
                  <span className="text-lg font-bold text-purple-600">
                    {company.signals.thesisFit.score}/10
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {company.signals.thesisFit.reason}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${(company.signals.thesisFit.score / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keywords & Team */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {company.enrichedData?.keywords &&
          company.enrichedData.keywords.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Keywords
              </h2>
              <div className="flex flex-wrap gap-2">
                {company.enrichedData.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

        {company.enrichedData?.foundingTeam &&
          company.enrichedData.foundingTeam.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Founding Team
              </h2>
              <ul className="space-y-2">
                {company.enrichedData.foundingTeam.map((member) => (
                  <li key={member} className="text-gray-700 flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2" />
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Notes</h2>

        {notesLoading ? (
          <p className="text-gray-500">Loading notes...</p>
        ) : notes && notes.length > 0 ? (
          <div className="mb-8 space-y-4 pb-8 border-b border-gray-200">
            {notes.map((note: any) => (
              <div key={note._id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{note.author}</p>
                    <p className="text-xs text-gray-500">
                      {note.type && (
                        <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium mr-2">
                          {note.type}
                        </span>
                      )}
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">{note.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-8 pb-8 border-b border-gray-200">
            No notes yet
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add a note
          </label>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write a note... (meeting, research insight, signal, or todo)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            rows={4}
          />
          <button 
            onClick={handleSaveNote}
            disabled={savingNote || !noteText.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {savingNote ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  )
}
