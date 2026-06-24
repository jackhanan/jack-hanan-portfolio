import FadeIn from '@/components/ui/FadeIn'

export default function Hero() {
  return (
    <section className="pt-40 pb-24 px-6 lg:px-12 max-w-site mx-auto">
      <FadeIn>
        <div className="max-w-3xl">
          <p className="text-xs tracking-widest uppercase text-mid mb-6 font-sans">
            Architecture Student / Designer
          </p>
          <h1 className="font-serif text-display font-light text-charcoal text-balance mb-8">
            Jack Hanan
          </h1>
          <p className="text-base text-mid leading-relaxed max-w-xl font-sans font-light">
            Based in Melbourne. Interested in civic infrastructure, material culture,
            and the negotiation between buildings and cities.
          </p>
        </div>
      </FadeIn>
    </section>
  )
}
