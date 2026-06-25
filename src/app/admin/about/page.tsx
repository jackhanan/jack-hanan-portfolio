import { readAbout } from '@/lib/about'
import AboutEditor from '@/components/admin/AboutEditor'
import type { AboutData } from '@/types'

export const dynamic = 'force-dynamic'

const EMPTY: AboutData = {
  heroEyebrow: '',
  heroName: '',
  heroTagline: '',
  bio: '',
  photo: '',
  skills: [],
  software: [],
  education: [],
  email: '',
  linkedin: '',
  resumeUrl: '/resume.pdf',
}

export default async function AdminAboutPage() {
  let about: AboutData = EMPTY
  try {
    about = await readAbout()
  } catch {
    // Editor will open empty; saving will persist to Redis
  }
  return <AboutEditor initial={about} />
}
