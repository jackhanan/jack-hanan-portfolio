import { readAbout } from '@/lib/about'
import FadeIn from '@/components/ui/FadeIn'

export default async function Hero() {
  let about
  try {
    about = await readAbout()
  } catch {
    about = { heroEyebrow: '', heroName: '', heroTagline: '' }
  }

  return (
    <section className="pt-28 md:pt-40 pb-16 md:pb-24 px-6 lg:px-12 max-w-site mx-auto">
      <FadeIn>
        <div className="max-w-3xl">
          {about.heroEyebrow && (
            <p className="text-xs tracking-widest uppercase text-mid mb-6 font-sans">
              {about.heroEyebrow}
            </p>
          )}
          {about.heroName && (
            <h1 className="font-serif text-display font-light text-charcoal text-balance mb-8">
              {about.heroName}
            </h1>
          )}
          {about.heroTagline && (
            <p className="text-base text-mid leading-relaxed max-w-xl font-sans font-light">
              {about.heroTagline}
            </p>
          )}
        </div>
      </FadeIn>
    </section>
  )
}
