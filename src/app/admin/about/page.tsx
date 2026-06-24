import { readAbout } from '@/lib/about'
import AboutEditor from '@/components/admin/AboutEditor'

export const revalidate = 0

export default async function AdminAboutPage() {
  const about = await readAbout()
  return <AboutEditor initial={about} />
}
