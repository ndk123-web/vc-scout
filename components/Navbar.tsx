'use client'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-blue-600">VCscout</h1>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
            Help
          </button>
          <button className="w-8 h-8 bg-blue-500 rounded-full text-white text-xs font-bold flex items-center justify-center hover:bg-blue-600 transition">
            JD
          </button>
        </div>
      </div>
    </nav>
  )
}
