import type { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'
import { readAbout } from '@/lib/about'

export const metadata: Metadata = { title: 'Contact' }
export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  let email = ''
  let linkedin = ''
  try {
    const about = await readAbout()
    email = about.email ?? ''
    linkedin = about.linkedin ?? ''
  } catch {}

  return <ContactForm email={email} linkedin={linkedin} />
}
