import { Link, createFileRoute } from "@tanstack/react-router";
import { Moon, Sun, Wind, Flower2, Bath, BookOpen } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SmartImage } from "@/components/ui-luxe/SmartImage";
import { Reveal } from "@/components/ui-luxe/Reveal";
import { SectionHeading } from "@/components/ui-luxe/SectionHeading";
import { buttonClass } from "@/components/ui-luxe/button";

export const Route = createFileRoute("/_site/rituals")({
  head: () => ({
    meta: [
      { title: "Our Rituals — Svarna Rituals" },
      { name: "description", content: "Morning and evening skincare ritual concepts, self-care inspiration and mindful routines from Svarna Rituals." },
      { property: "og:title", content: "Our Rituals — Svarna Rituals" },
      { property: "og:description", content: "Morning and evening ritual concepts for mindful skincare." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RitualsPage,
});

const MORNING = [
  { step: "Awaken", text: "Begin with a glass of water and three slow breaths by the window." },
  { step: "Cleanse", text: "A gentle cleanse with cool water to refresh the senses." },
  { step: "Mist", text: "A fine veil of mist — a moment of pause before the day begins." },
  { step: "Serum & Moisture", text: "Layer light to rich, pressing each texture softly into the skin." },
];
const EVENING = [
  { step: "Unwind", text: "Dim the lights, light a candle and let the day settle." },
  { step: "Cleanse", text: "Remove the day slowly, with warm water and unhurried hands." },
  { step: "Mask (weekly)", text: "Once a week, give yourself ten still minutes with a mask." },
  { step: "Seal with oil", text: "Warm a few drops between your palms and press gently." },
];

function RitualTimeline({ items }: { items: typeof MORNING }) {
  return (
    <ol className="relative mt-10 space-y-8 border-l border-gold/40 pl-8">
      {items.map((it, i) => (
        <Reveal as="li" key={it.step} delay={i * 90} className="relative">
          <span className="absolute -left-[2.6rem] flex h-8 w-8 items-center justify-center rounded-full border border-gold/60 bg-background font-serif text-sm text-gold">{i + 1}</span>
          <h4 className="text-2xl">{it.step}</h4>
          <p className="mt-1 text-sm leading-relaxed opacity-75">{it.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}

function RitualsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Rituals"
        title={<>Skincare as <em className="text-gold-soft">ceremony</em></>}
        text="Ritual concepts to bring presence, rhythm and calm to your day — from first light to candlelight."
        image="img:wellness"
        imageAlt="Stone bathtub with rose petals and candles at golden hour"
      />

      {/* Morning */}
      <section className="container-luxe grid items-center gap-14 py-24 lg:grid-cols-2 lg:gap-24 lg:py-32">
        <Reveal className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift">
            <SmartImage src="img:ritual-morning" alt="Sunlit marble vanity with skincare and white flowers" className="h-full w-full object-cover" />
          </div>
          <span className="absolute -right-3 -top-3 flex h-20 w-20 items-center justify-center rounded-full bg-gold-gradient text-forest-deep shadow-gold sm:-right-6 sm:-top-6">
            <Sun className="h-8 w-8" strokeWidth={1.3} />
          </span>
        </Reveal>
        <div className="text-forest">
          <p className="eyebrow">The Morning Ritual</p>
          <h2 className="mt-5 text-5xl sm:text-6xl">Awaken gently</h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">A fresh, light ritual concept designed to welcome the day with clarity and calm.</p>
          <RitualTimeline items={MORNING} />
        </div>
      </section>

      {/* Evening */}
      <section className="bg-forest-gradient py-24 text-ivory lg:py-32">
        <div className="container-luxe grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div className="order-2 lg:order-1">
            <p className="eyebrow">The Evening Ritual</p>
            <h2 className="mt-5 text-5xl sm:text-6xl">Let the day dissolve</h2>
            <p className="mt-6 leading-relaxed text-ivory/70">A slower, richer ritual concept to close the day with warmth, scent and stillness.</p>
            <div className="[&_li>span]:bg-forest-deep"><RitualTimeline items={EVENING} /></div>
          </div>
          <Reveal className="relative order-1 lg:order-2">
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift">
              <SmartImage src="img:ritual-evening" alt="Candlelit vanity with amber bottles and lavender" className="h-full w-full object-cover" />
            </div>
            <span className="absolute -left-3 -top-3 flex h-20 w-20 items-center justify-center rounded-full bg-ivory text-forest shadow-lift sm:-left-6 sm:-top-6">
              <Moon className="h-8 w-8" strokeWidth={1.3} />
            </span>
          </Reveal>
        </div>
      </section>

      {/* Self-care inspiration */}
      <section className="container-luxe py-24 lg:py-32">
        <SectionHeading eyebrow="Self-care Inspiration" title="Small rituals, deeply felt" text="Beyond skincare — simple practices to weave stillness into everyday life." />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            { Icon: Wind, title: "Breath", text: "Five slow breaths before you begin — the simplest ritual of all.", img: "img:journal-stones" },
            { Icon: Flower2, title: "Scent", text: "Fresh flowers or a bowl of petals to awaken the senses.", img: "img:journal-rose" },
            { Icon: BookOpen, title: "Reflection", text: "A cup of herbal tea and a few lines in a journal.", img: "img:journal-tea" },
          ].map(({ Icon, title, text, img }, i) => (
            <Reveal key={title} delay={i * 100} className="group overflow-hidden rounded-[2rem] bg-card shadow-soft">
              <div className="aspect-[4/3] overflow-hidden">
                <SmartImage src={img} alt={title} className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
              </div>
              <div className="p-8">
                <Icon className="h-6 w-6 text-gold" strokeWidth={1.3} />
                <h3 className="mt-4 text-3xl text-forest">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Weekly routine concept */}
      <section className="bg-beige/50 py-24">
        <div className="container-luxe">
          <SectionHeading eyebrow="Routine Concepts" title="A week, in rhythm" />
          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
              <Reveal key={d} delay={i * 50} className={`rounded-2xl border p-5 text-center ${i === 6 ? "border-gold bg-forest text-ivory" : "bg-card"}`}>
                <p className="eyebrow">{d}</p>
                <p className={`mt-3 font-serif text-xl ${i === 6 ? "text-ivory" : "text-forest"}`}>{i === 2 || i === 6 ? "Mask & Bath" : i % 2 ? "Evening Oil" : "Classic Ritual"}</p>
                {i === 6 && <Bath className="mx-auto mt-3 h-5 w-5 text-gold" />}
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">Ritual concepts are illustrative inspiration, not personalised skincare advice.</p>
          <div className="mt-10 text-center">
            <Link to="/collections" className={buttonClass("primary", "lg")}>Shop the Ritual</Link>
          </div>
        </div>
      </section>
    </>
  );
}
