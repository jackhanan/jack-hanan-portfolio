'use client'

import { useState } from 'react'
import FadeIn from '@/components/ui/FadeIn'

interface Props {
  email: string
  linkedin: string
  basedIn: string
}

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactForm({ email, linkedin, basedIn }: Props) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Network error — please try again.')
      setStatus('error')
    }
  }

  const inputClass =
    'w-full border-b border-charcoal/20 bg-transparent py-3 text-sm text-charcoal font-sans placeholder-mid/60 focus:outline-none focus:border-accent transition-colors duration-200'

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24 px-6 lg:px-12 max-w-site mx-auto">
      <FadeIn>
        <h1 className="font-serif text-headline font-light text-charcoal arch-rule pt-8 pb-12">
          Contact
        </h1>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form */}
          <div className="lg:col-span-6">
            {status === 'success' ? (
              <div className="py-12">
                <p className="font-serif text-2xl font-light text-charcoal">
                  Message sent.
                </p>
                <p className="text-sm text-mid mt-3 font-sans">
                  Thanks for getting in touch — I'll be in touch soon.
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

                {status === 'error' && (
                  <p className="text-sm font-sans text-red-600">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="text-sm tracking-widest uppercase font-sans text-canvas bg-charcoal px-8 py-3 hover:bg-accent transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
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
                  Jack Hanan
                </a>
              </div>
            )}

            {basedIn && (
              <div>
                <p className="text-xs tracking-widest uppercase text-mid font-sans mb-2">Based in</p>
                <p className="text-sm text-charcoal font-sans">{basedIn}</p>
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
