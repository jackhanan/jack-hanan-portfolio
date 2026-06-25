import type { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  return <ContactForm />
}
