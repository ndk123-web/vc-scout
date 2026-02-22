import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'VC Scouting',
  description: 'AI-powered startup discovery and tracking platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 p-8 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
