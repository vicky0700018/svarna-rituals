import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Leaf, Moon, Sparkles, Sun } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { SmartImage } from "@/components/ui-luxe/SmartImage";
import { Reveal } from "@/components/ui-luxe/Reveal";
import { SectionHeading } from "@/components/ui-luxe/SectionHeading";
import { buttonClass } from "@/components/ui-luxe/button";
import { DemoBadge } from "@/components/ui-luxe/DemoBadge";
import { ProductCard } from "@/components/site/ProductCard";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { HeroHeading } from "@/components/site/HeroHeading";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "Svarna Rituals — Nature's Wisdom. Your Skin's Ritual." },
      { name: "description", content: "Discover Svarna Rituals: nature-inspired, cruelty-free botanical skincare and wellness blending traditional wisdom with modern skincare science." },
      { property: "og:title", content: "Svarna Rituals — Nature's Wisdom. Your Skin's Ritual." },
      { property: "og:description", content: "Nature-inspired, cruelty-free botanical skincare and wellness from Mumbai." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const SAMPLE_INGREDIENTS = [
  { name: "Saffron", note: "Treasured for centuries in Indian traditions and celebrated for its golden hue — an echo of svarna, gold." },
  { name: "Rose", note: "A timeless floral of bathing rituals and offerings, symbolising softness and care." },
  { name: "Turmeric", note: "A golden root woven through household beauty folklore across generations." },
  { name: "Sandalwood", note: "A warm, woody note long associated with calm, contemplation and ceremony." },
];

function HomePage() {
  const { data } = useStore();
  const hp = data.homepage;
  const featured = hp.featuredIds
    .map((id) => data.products.find((p) => p.id === id && p.published))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const articles = data.articles.filter((a) => a.published).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const gallery = data.gallery.filter((g) => g.visible).slice(0, 6);

  return (
    <>
      {/* B. Hero */}
      <section className="relative -mt-px flex min-h-[calc(100svh-7rem)] items-center overflow-hidden bg-forest-deep text-ivory">
        <div className="absolute inset-0">
          <SmartImage src={hp.heroImage} alt="Svarna Rituals botanical skincare bottles among lush leaves" loading="eager" className="h-full w-full object-cover object-[70%_center] animate-slow-zoom" />
          <div className="absolute inset-0 bg-hero-veil" />
          <div className="absolute inset-0 bg-bottom-veil opacity-60 lg:opacity-30" />
        </div>
        <div className="container-luxe relative py-24">
          <div className="max-w-2xl">
            <p className="eyebrow animate-fade-up">{hp.heroEyebrow}</p>
            <h1 className="mt-6 text-[3.2rem] leading-[1.02] animate-fade-up [animation-delay:120ms] sm:text-7xl lg:text-[5.6rem]">
              <HeroHeading text={hp.heroHeading} />
            </h1>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-ivory/80 animate-fade-up [animation-delay:240ms] sm:text-lg">{hp.heroDescription}</p>
            <div className="mt-10 flex flex-wrap gap-4 animate-fade-up [animation-delay:360ms]">
              <Link to="/collections" className={buttonClass("gold", "lg")}>
                Explore Collection <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
              <Link to="/ingredients" className={buttonClass("lightOutline", "lg")}>Discover Our Philosophy</Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 hidden border-t border-ivory/15 bg-forest-deep/40 backdrop-blur-md md:block">
          <div className="container-luxe grid grid-cols-3 divide-x divide-ivory/15 py-5 text-center text-[0.68rem] uppercase tracking-[0.3em] text-ivory/80">
            <span className="flex items-center justify-center gap-3"><Leaf className="h-4 w-4 text-gold" /> Nature-inspired</span>
            <span className="flex items-center justify-center gap-3"><Sparkles className="h-4 w-4 text-gold" /> Cruelty-free positioning</span>
            <span className="flex items-center justify-center gap-3"><Sun className="h-4 w-4 text-gold" /> Tradition × Science</span>
          </div>
        </div>
      </section>

      {/* C. Brand introduction */}
      <section className="container-luxe grid items-center gap-16 py-24 lg:grid-cols-2 lg:gap-24 lg:py-36">
        <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border border-gold/40 sm:-left-6 sm:-top-6" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift">
            <SmartImage src="img:lifestyle" alt="Hands opening an ivory cream jar among eucalyptus and sage" className="h-full w-full object-cover transition-transform duration-[2s] hover:scale-105" />
          </div>
          <div className="absolute -bottom-10 -right-2 w-40 overflow-hidden rounded-2xl border-4 border-background shadow-lift sm:-right-8 sm:w-52">
            <SmartImage src="img:texture" alt="Cream, oil and gel textures on travertine" className="aspect-square w-full object-cover" />
          </div>
        </Reveal>
        <div>
          <SectionHeading align="left" eyebrow="Welcome to Svarna Rituals" title={hp.introTitle} />
          <Reveal delay={120}>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{hp.introText}</p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Our approach is quietly considered: nature-inspired formulation concepts, a cruelty-free brand positioning, and rituals that invite you to slow down and reconnect.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link to="/about" className={buttonClass("primary", "md")}>Our Story</Link>
              <Link to="/rituals" className="link-underline text-xs uppercase tracking-[0.22em] text-forest">Explore rituals</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* D. Featured collection */}
      <section className="bg-secondary/60 py-24 lg:py-32">
        <div className="container-luxe">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading align="left" eyebrow="Featured Collection" title="Objects of daily ritual" text="A first look at the Svarna Rituals world — botanical-inspired textures in tactile glass, ceramic and gold." />
            <Link to="/collections" className={buttonClass("outline", "md", "shrink-0")}>View All Products</Link>
          </div>
          <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 90}><ProductCard product={p} /></Reveal>
            ))}
          </div>
          <p className="mt-12 text-center text-xs uppercase tracking-[0.22em] text-muted-foreground">Products and prices shown are illustrative demo content</p>
        </div>
      </section>

      {/* E. Brand philosophy */}
      <section className="relative overflow-hidden bg-forest-gradient py-24 text-ivory lg:py-32">
        <div className="container-luxe grid items-center gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
              <SmartImage src="img:philosophy" alt="Brass mortar with herbs beside a glass beaker of botanical oil" className="h-full w-full object-cover" />
            </div>
          </Reveal>
          <div className="lg:col-span-6">
            <SectionHeading tone="light" align="left" eyebrow="Our Philosophy" title={<>Ancient wisdom, <em className="text-gold-soft">modern care</em></>} />
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {hp.philosophy.map((p, i) => (
                <Reveal key={p.id} delay={i * 100} className="border-t border-ivory/20 pt-6">
                  <span className="font-serif text-xl text-gold">{p.eyebrow}</span>
                  <h3 className="mt-2 text-2xl">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/70">{p.text}</p>
                </Reveal>
              ))}
            </div>
            <Link to="/ingredients" className={buttonClass("lightOutline", "md", "mt-12")}>Discover Our Philosophy</Link>
          </div>
        </div>
      </section>

      {/* F. Ingredients */}
      <section className="py-24 lg:py-32">
        <div className="container-luxe">
          <SectionHeading eyebrow="Botanical Inspiration" title="Rooted in the garden of tradition" text="The botanicals that inspire our world. Shown as illustrative sample content — not a statement of any product's formulation." />
          <Reveal className="relative mt-14 overflow-hidden rounded-[2rem]">
            <SmartImage src="img:ingredients" alt="Turmeric, saffron, rose petals, sandalwood, honey and neem in bowls" className="aspect-[16/9] w-full object-cover sm:aspect-[21/9]" />
            <DemoBadge label="Sample content" className="absolute left-5 top-5" />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SAMPLE_INGREDIENTS.map((ing, i) => (
              <Reveal key={ing.name} delay={i * 90} className="group rounded-2xl border bg-card p-7 transition duration-500 hover:-translate-y-1 hover:border-gold/60 hover:shadow-soft">
                <Leaf className="h-6 w-6 text-gold transition-transform duration-500 group-hover:rotate-12" strokeWidth={1.2} />
                <h3 className="mt-5 text-3xl text-forest">{ing.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{ing.note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* G. Rituals */}
      <section className="bg-beige/50 py-24 lg:py-32">
        <div className="container-luxe">
          <SectionHeading eyebrow="Our Rituals" title="From first light to candlelight" text="Skincare as a ceremony — two ritual concepts to frame your day with intention." />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {[
              { img: "img:ritual-morning", alt: "Sunlit marble vanity with skincare bottles and white flowers", Icon: Sun, title: "The Morning Ritual", steps: ["Cleanse", "Mist", "Serum", "Moisturise"], tone: "Awaken gently." },
              { img: "img:ritual-evening", alt: "Candlelit vanity with amber bottles and lavender", Icon: Moon, title: "The Evening Ritual", steps: ["Unwind", "Cleanse", "Mask", "Seal with oil"], tone: "Let the day dissolve." },
            ].map((r, i) => (
              <Reveal key={r.title} delay={i * 120}>
                <Link to="/rituals" className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[5/6]">
                  <SmartImage src={r.img} alt={r.alt} className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-bottom-veil" />
                  <div className="absolute inset-x-0 bottom-0 p-8 text-ivory sm:p-10">
                    <r.Icon className="h-6 w-6 text-gold" strokeWidth={1.3} />
                    <p className="mt-4 font-serif text-lg italic text-gold-soft">{r.tone}</p>
                    <h3 className="mt-1 text-4xl sm:text-5xl">{r.title}</h3>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {r.steps.map((s, idx) => (
                        <span key={s} className="rounded-full border border-ivory/30 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-ivory/85">{idx + 1}. {s}</span>
                      ))}
                    </div>
                  </div>
                  <span className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-ivory/90 text-forest transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/rituals" className={buttonClass("primary", "lg")}>Explore Rituals</Link>
          </div>
        </div>
      </section>

      {/* H. Why Svarna Rituals */}
      <section className="container-luxe grid items-center gap-16 py-24 lg:grid-cols-2 lg:py-32">
        <div className="order-2 lg:order-1">
          <SectionHeading align="left" eyebrow="Why Svarna Rituals" title="Beauty, held with intention" />
          <div className="mt-12 space-y-2">
            {hp.why.map((w, i) => (
              <Reveal key={w.id} delay={i * 90} className="group flex gap-6 rounded-2xl p-5 transition hover:bg-secondary/70">
                <span className="mt-1 font-serif text-3xl text-gold">0{i + 1}</span>
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">{w.eyebrow}</p>
                  <h3 className="mt-1 text-2xl text-forest">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal className="order-1 lg:order-2">
          <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-t-full shadow-lift lg:max-w-none">
            <SmartImage src="img:application" alt="Woman gently pressing facial oil into her cheek" className="h-full w-full object-cover" />
          </div>
        </Reveal>
      </section>

      {/* I. Journal preview */}
      <section className="bg-secondary/60 py-24 lg:py-32">
        <div className="container-luxe">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading align="left" eyebrow="The Journal" title="Notes on ritual & nature" />
            <Link to="/journal" className={buttonClass("outline", "md", "shrink-0")}>All Articles</Link>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {articles.map((a, i) => (
              <Reveal key={a.id} delay={i * 100}>
                <article className="group">
                  <Link to="/journal/$id" params={{ id: a.id }} className="block overflow-hidden rounded-2xl">
                    <SmartImage src={a.image} alt={a.title} className="aspect-[4/3] w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
                  </Link>
                  <p className="mt-5 text-[0.62rem] uppercase tracking-[0.25em] text-gold">
                    {data.journalCategories.find((c) => c.id === a.categoryId)?.name} · {formatDate(a.date)}
                  </p>
                  <Link to="/journal/$id" params={{ id: a.id }}>
                    <h3 className="mt-3 text-2xl leading-snug text-forest transition group-hover:text-gold">{a.title}</h3>
                  </Link>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
                  <Link to="/journal/$id" params={{ id: a.id }} className="link-underline mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-forest">
                    Read More <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* J. Gallery */}
      <section className="py-24 lg:py-32">
        <div className="container-luxe">
          <SectionHeading eyebrow="The Svarna World" title="A gallery of quiet moments" />
          <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[220px] md:grid-cols-4">
            {gallery.map((g, i) => (
              <Reveal
                key={g.id}
                delay={i * 70}
                className={[
                  "group relative overflow-hidden rounded-2xl",
                  i === 0 ? "col-span-2 row-span-2" : "",
                  i === 3 ? "md:row-span-2" : "",
                ].join(" ")}
              >
                <SmartImage src={g.image} alt={g.title} className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110" />
                <div className="absolute inset-0 flex items-end bg-bottom-veil p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="text-ivory">
                    <p className="text-[0.6rem] uppercase tracking-[0.25em] text-gold-soft">{g.caption}</p>
                    <p className="font-serif text-xl">{g.title}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* K. Newsletter */}
      <section className="relative overflow-hidden bg-forest-gradient py-24 text-ivory">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-gold/20" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-[28rem] w-[28rem] rounded-full border border-gold/15" />
        <div className="container-luxe relative grid items-center gap-10 lg:grid-cols-2">
          <SectionHeading tone="light" align="left" eyebrow="The Svarna Circle" title={<>Rituals, delivered <em className="text-gold-soft">gently</em></>} text="Be the first to hear about launches, seasonal rituals and journal stories. No noise — only the essentials." />
          <Reveal delay={150}><NewsletterForm source="Homepage" tone="light" /></Reveal>
        </div>
      </section>
    </>
  );
}
