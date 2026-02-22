'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'Companies', href: '/companies', icon: '🏢' },
    { label: 'Lists', href: '/lists', icon: '📋' },
  ]

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-56px)] w-64 bg-white border-r border-gray-200 p-4">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
