import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProject } from '@/lib/projects'
import ProjectGallery from '@/components/projects/ProjectGallery'
import FadeIn from '@/components/ui/FadeIn'

// All project pages are rendered on-demand at request time.
// This means new projects added via the admin appear immediately
// without needing a redeploy.
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProject(params.slug)
  if (!project) return {}
  return { title: project.title }
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug)
  if (!project || !project.visible) notFound()

  const paragraphs = project.description.split('\n\n').filter(Boolean)

  return (
    <article className="pt-24">
      {/* Full-bleed hero */}
      {project.heroImage && (
        <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden bg-charcoal/10">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Project header */}
      <FadeIn>
        <div className="max-w-site mx-auto px-6 lg:px-12 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-8">
              <h1 className="font-serif text-display font-light text-charcoal text-balance">
                {project.title}
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pt-4">
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs tracking-widest uppercase text-mid font-sans">Year</dt>
                  <dd className="text-sm text-charcoal font-sans mt-1">{project.year}</dd>
                </div>
                <div>
                  <dt className="text-xs tracking-widest uppercase text-mid font-sans">Category</dt>
                  <dd className="text-sm text-charcoal font-sans mt-1">{project.category}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Description */}
      <FadeIn delay={150}>
        <div className="max-w-site mx-auto px-6 lg:px-12 mt-12">
          <div className="arch-rule pt-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              <div className="lg:col-start-1 lg:col-span-7 space-y-5">
                {paragraphs.map((para, i) => (
                  <p key={i} className="text-base lg:text-lg text-charcoal/80 font-sans font-light leading-[1.75]">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Gallery */}
      <FadeIn delay={200}>
        <div className="max-w-site mx-auto px-6 lg:px-12">
          <ProjectGallery images={project.gallery} projectTitle={project.title} />
        </div>
      </FadeIn>

      {/* Back link */}
      <div className="max-w-site mx-auto px-6 lg:px-12 mt-20 mb-8">
        <Link
          href="/projects"
          className="text-xs tracking-widest uppercase text-mid hover:text-charcoal transition-colors duration-200 font-sans inline-flex items-center gap-2"
        >
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All Projects
        </Link>
      </div>
    </article>
  )
}
