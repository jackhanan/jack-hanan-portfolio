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
      <div className="arch-rule pt-10 flex items-center justify-between">
        <div>
          {prev && (
            <Link
              href={`/projects/${prev.id}`}
              className="group inline-flex items-center gap-3 text-mid hover:text-charcoal transition-colors duration-200"
            >
              <svg width="16" height="28" viewBox="0 0 16 28" fill="none" aria-hidden="true">
                <path d="M12 4L3 14l9 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-serif text-lg font-light">{prev.title}</span>
            </Link>
          )}
        </div>
        <div>
          {next && (
            <Link
              href={`/projects/${next.id}`}
              className="group inline-flex items-center gap-3 text-mid hover:text-charcoal transition-colors duration-200"
            >
              <span className="font-serif text-lg font-light">{next.title}</span>
              <svg width="16" height="28" viewBox="0 0 16 28" fill="none" aria-hidden="true">
                <path d="M4 4l9 10-9 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
