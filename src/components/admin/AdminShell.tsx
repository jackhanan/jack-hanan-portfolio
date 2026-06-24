'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const isLoginPage = (pathname: string) => pathname === '/admin'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // Login page renders without the shell chrome
  if (isLoginPage(pathname)) return <>{children}</>

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin')
  }

  const navLink = (href: string, label: string) => {
    const active = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href))
    return (
      <Link
        href={href}
        className={`block px-4 py-2.5 text-sm font-sans rounded transition-colors duration-150 ${
          active
            ? 'bg-[#2A2A28] text-[#E8E8E4]'
            : 'text-[#888882] hover:text-[#E8E8E4] hover:bg-[#222220]'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-[#141412] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[#111110] border-r border-[#222220] flex flex-col">
        <div className="p-5 border-b border-[#222220]">
          <p className="text-xs tracking-widest uppercase text-[#555550] font-sans">Studio CMS</p>
          <p className="text-sm text-[#E8E8E4] font-sans mt-1">Jack Hanan</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navLink('/admin/dashboard', 'Dashboard')}
          {navLink('/admin/projects/new', '+ New Project')}
          {navLink('/admin/about', 'About Page')}
        </nav>

        <div className="p-3 border-t border-[#222220] space-y-0.5">
          <Link
            href="/"
            target="_blank"
            className="block px-4 py-2.5 text-sm font-sans text-[#888882] hover:text-[#E8E8E4] hover:bg-[#222220] rounded transition-colors duration-150"
          >
            View Site ↗
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left block px-4 py-2.5 text-sm font-sans text-[#888882] hover:text-red-400 hover:bg-[#222220] rounded transition-colors duration-150 cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
