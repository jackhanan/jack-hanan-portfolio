import Link from 'next/link'
import type { Project } from '@/types'

interface Props {
  prev: Project | null
  next: Project | null
}

export default function ProjectNav({ prev, next }: Props) {
  if (!prev && !next) return null

  return (
    <div className="max-w-site mx-auto px-6 lg:px-12 mt-16 mb-16">
      <div className="arch-rule pt-10 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          {prev && (
            <Link
              href={`/projects/${prev.id}`}
              className="group inline-flex items-center gap-2 text-mid hover:text-charcoal transition-colors duration-200 max-w-full"
            >
              <svg className="shrink-0" width="12" height="22" viewBox="0 0 12 22" fill="none" aria-hidden="true">
                <path d="M9 3L2 11l7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-serif text-sm md:text-lg font-light truncate">{prev.title}</span>
            </Link>
          )}
        </div>
        <div className="min-w-0 flex-1 flex justify-end">
          {next && (
            <Link
              href={`/projects/${next.id}`}
              className="group inline-flex items-center gap-2 text-mid hover:text-charcoal transition-colors duration-200 max-w-full"
            >
              <span className="font-serif text-sm md:text-lg font-light truncate">{next.title}</span>
              <svg className="shrink-0" width="12" height="22" viewBox="0 0 12 22" fill="none" aria-hidden="true">
                <path d="M3 3l7 8-7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
