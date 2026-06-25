'use client'

import { useState } from 'react'
import FadeIn from '@/components/ui/FadeIn'

interface Props {
  email: string
  linkedin: string
}

export default function ContactForm({ email, linkedin }: Props) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const to = email || 'jack.hanan@gmail.com'
    const body = `Name: ${form.name}%0AEmail: ${form.email}%0A%0A${form.message}`
    window.location.href = `mailto:${to}?subject=Portfolio Enquiry — ${form.name}&body=${body}`
    setSent(true)
  }

  const inputClass =
    'w-full border-b border-charcoal/20 bg-transparent py-3 text-sm text-charcoal font-sans placeholder-mid/60 focus:outline-none focus:border-accent transition-colors duration-200'

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-site mx-auto">
      <FadeIn>
        <h1 className="font-serif text-headline font-light text-charcoal arch-rule pt-8 pb-12">
          Contact
        </h1>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form */}
          <div className="lg:col-span-6">
            {sent ? (
              <div className="py-12">
                <p className="font-serif text-2xl font-light text-charcoal">
                  Your email client has opened.
                </p>
                <p className="text-sm text-mid mt-3 font-sans">
                  If nothing happened,{' '}
                  <a href={`mailto:${email || 'jack.hanan@gmail.com'}`} className="text-accent hover:underline">
                    send directly
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label htmlFor="name" className="block text-xs tracking-widest uppercase text-mid font-sans mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs tracking-widest uppercase text-mid font-sans mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs tracking-widest uppercase text-mid font-sans mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell me about the role or project…"
                  />
                </div>

                <button
                  type="submit"
                  className="text-sm tracking-widest uppercase font-sans text-canvas bg-charcoal px-8 py-3 hover:bg-accent transition-colors duration-200 cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact details */}
          <div className="lg:col-span-4 lg:col-start-9 space-y-8">
            {email && (
              <div>
                <p className="text-xs tracking-widest uppercase text-mid font-sans mb-2">Email</p>
                <a
                  href={`mailto:${email}`}
                  className="text-sm text-charcoal hover:text-accent transition-colors duration-200 font-sans"
                >
                  {email}
                </a>
              </div>
            )}

            {linkedin && (
              <div>
                <p className="text-xs tracking-widest uppercase text-mid font-sans mb-2">LinkedIn</p>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-charcoal hover:text-accent transition-colors duration-200 font-sans"
                >
                  {linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </div>
            )}

            <div>
              <p className="text-xs tracking-widest uppercase text-mid font-sans mb-2">Based in</p>
              <p className="text-sm text-charcoal font-sans">Melbourne, Australia</p>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
