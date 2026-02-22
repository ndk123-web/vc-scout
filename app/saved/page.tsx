export default function SavedSearchesPage() {
  const dummySearches: any[] = []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saved Searches</h1>
          <p className="text-gray-600 mt-1">
            Reusable filters to quickly find companies matching your criteria
          </p>
        </div>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
          + New Search
        </button>
      </div>

      {dummySearches.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No saved searches yet
          </h2>
          <p className="text-gray-600 mb-6">
            Create a saved search filter to quickly find companies matching your
            thesis.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Example: "Series A AI companies in SF with 10+ team members"
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            Create Your First Search
          </button>
        </div>
      )}

      {dummySearches.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          {dummySearches.map((search: any) => (
            <div
              key={search.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {search.name}
              </h2>
              <div className="text-sm text-gray-600 space-y-2 mb-4">
                {search.filters && (
                  <>
                    {search.filters.stage && (
                      <p>
                        <strong>Stage:</strong> {search.filters.stage}
                      </p>
                    )}
                    {search.filters.industry && (
                      <p>
                        <strong>Industry:</strong> {search.filters.industry}
                      </p>
                    )}
                  </>
                )}
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Edit Search →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
