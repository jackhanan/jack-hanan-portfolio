import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="arch-rule mt-24 py-8 px-6 lg:px-12">
      <div className="max-w-site mx-auto flex items-center justify-between">
        <p className="text-xs text-mid tracking-wide">
          Jack Hanan &copy; {year}
        </p>
        <Link
          href="/admin"
          className="text-xs text-mid/40 hover:text-mid transition-colors duration-300 tracking-wide"
          tabIndex={-1}
        >
          Studio Access
        </Link>
      </div>
    </footer>
  )
}
