'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <h1 className="text-2xl font-bold text-blue-600">VCscout</h1>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                MVP
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Help
            </button>
            <button className="w-8 h-8 bg-blue-500 rounded-full text-white text-xs font-bold flex items-center justify-center hover:bg-blue-600 transition">
              JD
            </button>
          </div>
        </div>
      </nav>

      {isHelpOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsHelpOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              👋 Welcome to VCscout
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-blue-100 p-3 rounded-lg h-fit text-xl">🏢</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Track Companies</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Add startups by simply pasting their URL. Our AI automatically fetches their data, categorizes them, and generates an investment summary.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-purple-100 p-3 rounded-lg h-fit text-xl">📋</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Curate Lists</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Create custom lists (e.g., "SaaS 2024", "GenAI Watchlist") to organize companies based on your investment thesis or deal stage.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-green-100 p-3 rounded-lg h-fit text-xl">✨</div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Enrichment</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    We automatically analyze company websites to extracting key signals like industry, location, and funding stage to save you research time.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
