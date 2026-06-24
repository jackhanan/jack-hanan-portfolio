'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Project } from '@/types'

interface Props {
  projects: Project[]
}

export default function NavClient({ projects }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-canvas/95 backdrop-blur-sm border-b border-charcoal/8">
      <div className="max-w-site mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo / Name */}
        <Link
          href="/"
          className="font-serif text-lg font-light tracking-wide text-charcoal hover:text-accent transition-colors duration-200"
        >
          Jack Hanan
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
          <Link
            href="/about"
            className={`text-sm tracking-wide transition-colors duration-200 ${
              isActive('/about') ? 'text-charcoal' : 'text-mid hover:text-charcoal'
            }`}
          >
            About
          </Link>

          {/* Projects dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              aria-expanded={dropdownOpen}
              aria-haspopup="listbox"
              className={`flex items-center gap-1.5 text-sm tracking-wide transition-colors duration-200 cursor-pointer ${
                isActive('/projects') ? 'text-charcoal' : 'text-mid hover:text-charcoal'
              }`}
            >
              Projects
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-3 w-64 bg-canvas border border-charcoal/10 shadow-lg shadow-charcoal/5 py-1">
                <Link
                  href="/projects"
                  className="block px-5 py-2.5 text-xs tracking-widest uppercase text-mid hover:text-charcoal hover:bg-charcoal/3 transition-colors duration-150"
                >
                  All Projects
                </Link>
                <div className="my-1 border-t border-charcoal/8" />
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block px-5 py-2.5 text-sm text-mid hover:text-charcoal hover:bg-charcoal/3 transition-colors duration-150"
                  >
                    {project.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className={`text-sm tracking-wide transition-colors duration-200 ${
              isActive('/contact') ? 'text-charcoal' : 'text-mid hover:text-charcoal'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden cursor-pointer p-2 text-mid hover:text-charcoal transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-charcoal/8 bg-canvas">
          <nav className="px-6 py-4 flex flex-col gap-1">
            <Link href="/about" className="py-3 text-sm tracking-wide text-charcoal border-b border-charcoal/8">
              About
            </Link>
            <Link href="/projects" className="py-3 text-sm tracking-wide text-charcoal border-b border-charcoal/8">
              All Projects
            </Link>
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="py-2.5 pl-4 text-sm text-mid hover:text-charcoal border-b border-charcoal/5"
              >
                {project.title}
              </Link>
            ))}
            <Link href="/contact" className="py-3 text-sm tracking-wide text-charcoal">
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
