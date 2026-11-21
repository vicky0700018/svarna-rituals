import { Link, createFileRoute } from "@tanstack/react-router";
import { FlaskConical, HeartHandshake, Leaf, Rabbit, ScrollText, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SmartImage } from "@/components/ui-luxe/SmartImage";
import { Reveal } from "@/components/ui-luxe/Reveal";
import { SectionHeading } from "@/components/ui-luxe/SectionHeading";
import { DemoBadge } from "@/components/ui-luxe/DemoBadge";
import { buttonClass } from "@/components/ui-luxe/button";

export const Route = createFileRoute("/_site/ingredients")({
  head: () => ({
    meta: [
      { title: "Ingredients & Philosophy — Svarna Rituals" },
      { name: "description", content: "Botanical inspiration, traditional beauty wisdom and modern skincare science — the philosophy behind Svarna Rituals." },
      { property: "og:title", content: "Ingredients & Philosophy — Svarna Rituals" },
      { property: "og:description", content: "Where botanical inspiration meets modern skincare science." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IngredientsPage,
});

const PILLARS = [
  { Icon: Leaf, title: "Botanical inspiration", text: "Leaves, petals, roots and resins — the natural world informs our colours, textures and sensorial cues." },
  { Icon: Sparkles, title: "Nature-inspired skincare", text: "Concepts imagined to feel close to nature: gentle, sensorial and beautifully simple." },
  { Icon: ScrollText, title: "Traditional beauty wisdom", text: "We honour self-care rituals passed down through generations as a source of inspiration." },
  { Icon: FlaskConical, title: "Modern skincare science", text: "A considered, contemporary approach to how skincare is developed, presented and used." },
  { Icon: HeartHandshake, title: "Thoughtful rituals", text: "Products imagined as part of a ritual — a pause for presence in the rhythm of the day." },
  { Icon: Rabbit, title: "Cruelty-free positioning", text: "Kindness is non-negotiable. Our brand is positioned around cruelty-free beauty." },
];

const SAMPLE = [
  { name: "Saffron", origin: "Crocus sativus", text: "Prized for centuries and associated with celebration and gold." },
  { name: "Rose", origin: "Rosa damascena", text: "A floral emblem of bathing rituals, offerings and softness." },
  { name: "Turmeric", origin: "Curcuma longa", text: "A golden root found throughout household beauty folklore." },
  { name: "Sandalwood", origin: "Santalum album", text: "A warm, woody note linked to calm and ceremony." },
  { name: "Aloe", origin: "Aloe barbadensis", text: "A familiar courtyard plant with a cool, gel-like leaf." },
  { name: "Neem", origin: "Azadirachta indica", text: "A revered tree that appears across traditional stories." },
];

function IngredientsPage() {
  return (
    <>
      <PageHero
        eyebrow="Ingredients & Philosophy"
        title={<>The wisdom of <em className="text-gold-soft">botanicals</em></>}
        text="An editorial look at the ideas that shape Svarna Rituals — from age-old traditions to modern skincare science."
        image="img:ingredients"
        imageAlt="Natural ingredients arranged in ceramic and brass bowls"
      />

      <section className="container-luxe py-24 lg:py-32">
        <SectionHeading eyebrow="Our Principles" title="Six ideas we return to, again and again" />
        <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 70} className="group bg-card p-10 transition duration-500 hover:bg-secondary/60">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold transition duration-500 group-hover:bg-gold group-hover:text-forest-deep">
                <Icon className="h-6 w-6" strokeWidth={1.3} />
              </span>
              <h3 className="mt-7 text-3xl text-forest">{title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-forest-gradient py-24 text-ivory lg:py-32">
        <div className="container-luxe grid items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading tone="light" align="left" eyebrow="Tradition × Science" title={<>Where the mortar meets <em className="text-gold-soft">the beaker</em></>} />
            <Reveal delay={100} className="mt-8 space-y-5 leading-relaxed text-ivory/75">
              <p>For generations, beauty was prepared by hand — herbs ground in brass, petals steeped in water, oils warmed in the sun. These rituals carried knowledge, patience and care.</p>
              <p>Modern skincare science brings structure, consistency and careful evaluation. Svarna Rituals sits at this meeting point: inspired by heritage, guided by contemporary understanding.</p>
            </Reveal>
          </div>
          <Reveal className="overflow-hidden rounded-[2rem]">
            <SmartImage src="img:philosophy" alt="Brass mortar with herbs beside a laboratory beaker" className="aspect-[4/3] w-full object-cover" />
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-24 lg:py-32">
        <div className="flex flex-col items-center gap-4 text-center">
          <SectionHeading eyebrow="Botanical Library" title="Plants that inspire us" text="Illustrative sample content celebrating botanicals found in beauty traditions. This is not a list of ingredients used in any Svarna Rituals product." />
          <DemoBadge label="Sample content" />
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <Reveal className="overflow-hidden rounded-[2rem] lg:col-span-5">
            <SmartImage src="img:botanicals" alt="Botanical leaves and flowers" className="h-full min-h-[380px] w-full object-cover" />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {SAMPLE.map((s, i) => (
              <Reveal key={s.name} delay={i * 60} className="rounded-2xl border bg-card p-6 transition hover:border-gold/60 hover:shadow-soft">
                <p className="text-[0.6rem] uppercase tracking-[0.25em] text-gold">{s.origin}</p>
                <h3 className="mt-2 text-3xl text-forest">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-beige/50 py-24">
        <div className="container-luxe flex flex-col items-center text-center">
          <Rabbit className="h-10 w-10 text-gold" strokeWidth={1.1} />
          <h2 className="mt-6 max-w-2xl text-4xl text-forest sm:text-5xl">Cruelty-free, by conviction</h2>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">Svarna Rituals is positioned as a cruelty-free brand. We believe that true beauty is kind to every living being.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/rituals" className={buttonClass("primary", "md")}>Explore Our Rituals</Link>
            <Link to="/collections" className={buttonClass("outline", "md")}>View Collection</Link>
          </div>
        </div>
      </section>
    </>
  );
}
