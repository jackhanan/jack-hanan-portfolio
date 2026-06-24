import type { Metadata } from 'next'
import Image from 'next/image'
import { readAbout } from '@/lib/about'
import FadeIn from '@/components/ui/FadeIn'

export const metadata: Metadata = { title: 'About' }
export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  let about
  try {
    about = await readAbout()
  } catch {
    about = null
  }

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-site mx-auto">
      <FadeIn>
        <h1 className="font-serif text-headline font-light text-charcoal arch-rule pt-8 pb-12">
          About
        </h1>
      </FadeIn>

      {!about ? (
        <p className="text-mid font-sans">Content unavailable.</p>
      ) : (
        <FadeIn delay={100}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Photo */}
            <div className="lg:col-span-4">
              <div className="relative aspect-[3/4] overflow-hidden bg-charcoal/8">
                {about.photo && (
                  <Image src={about.photo} alt="Jack Hanan" fill className="object-cover" priority />
                )}
              </div>
            </div>

            {/* Bio and details */}
            <div className="lg:col-span-7 lg:col-start-6 space-y-10">
              {/* Bio */}
              {about.bio && (
                <div className="space-y-5">
                  {about.bio.split('\n\n').filter(Boolean).map((para, i) => (
                    <p key={i} className="text-base lg:text-lg text-charcoal/80 font-sans font-light leading-[1.75]">
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* Resume download */}
              {about.resumeUrl && (
                <div>
                  <a
                    href={about.resumeUrl}
                    download
                    className="inline-flex items-center gap-2 text-sm text-charcoal border border-charcoal/20 px-5 py-2.5 hover:border-accent hover:text-accent transition-colors duration-200 font-sans tracking-wide"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M8 1v9M4 7l4 4 4-4M2 14h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Download CV
                  </a>
                </div>
              )}

              {/* Education */}
              {about.education?.length > 0 && (
                <div className="arch-rule pt-8">
                  <h2 className="font-serif text-xl font-light text-charcoal mb-5">Education</h2>
                  <div className="space-y-4">
                    {about.education.map((edu, i) => (
                      <div key={i} className="flex justify-between items-baseline gap-4">
                        <div>
                          <p className="text-sm text-charcoal font-sans">{edu.degree}</p>
                          <p className="text-xs text-mid font-sans mt-0.5">{edu.institution}</p>
                        </div>
                        <span className="text-xs text-mid font-sans shrink-0">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills + Software */}
              {(about.skills?.length > 0 || about.software?.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 arch-rule pt-8">
                  {about.skills?.length > 0 && (
                    <div>
                      <h2 className="font-serif text-xl font-light text-charcoal mb-5">Skills</h2>
                      <ul className="space-y-2">
                        {about.skills.map((skill) => (
                          <li key={skill} className="text-sm text-mid font-sans">{skill}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {about.software?.length > 0 && (
                    <div>
                      <h2 className="font-serif text-xl font-light text-charcoal mb-5">Software</h2>
                      <ul className="space-y-2 columns-2">
                        {about.software.map((sw) => (
                          <li key={sw} className="text-sm text-mid font-sans">{sw}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  )
}
