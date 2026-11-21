import { Link, createFileRoute } from "@tanstack/react-router";
import { Building2, Calendar, FileText, Landmark, MapPin, ShieldCheck, Users, Wallet } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHero } from "@/components/site/PageHero";
import { SmartImage } from "@/components/ui-luxe/SmartImage";
import { Reveal } from "@/components/ui-luxe/Reveal";
import { SectionHeading } from "@/components/ui-luxe/SectionHeading";
import { buttonClass } from "@/components/ui-luxe/button";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title: "About Us — Svarna Rituals" },
      { name: "description", content: "The story, vision and mission of Svarna Rituals — botanical skincare where traditional wisdom meets modern skincare science." },
      { property: "og:title", content: "About Svarna Rituals" },
      { property: "og:description", content: "Our story, vision, mission and company overview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data } = useStore();
  const s = data.settings;
  const overview = [
    { Icon: Building2, label: "Company Name", value: s.companyName },
    { Icon: FileText, label: "CIN", value: s.cin },
    { Icon: Calendar, label: "Incorporation Date", value: s.incorporationDate },
    { Icon: ShieldCheck, label: "Company Status", value: s.status },
    { Icon: Users, label: "Directors", value: s.directors },
    { Icon: Wallet, label: "Authorized & Paid-up Capital", value: s.capital },
    { Icon: Landmark, label: "Business Activity", value: "Manufacture of chemicals and chemical products, including preparations for perfuming/deodorizing and cleaning/polishing products, as per corporate filings." },
    { Icon: MapPin, label: "Registered Office", value: s.registeredOffice },
  ];

  return (
    <>
      <PageHero
        eyebrow="About Svarna Rituals"
        title={<>Beauty rooted in <em className="text-gold-soft">nature &amp; heritage</em></>}
        text="A botanical skincare and wellness brand from Mumbai — blending traditional wisdom with modern skincare science."
        image="img:botanicals"
        imageAlt="Ferns, olive branches, jasmine and soft roses in dappled light"
      />

      {/* Intro */}
      <section className="container-luxe py-24 lg:py-32">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">Brand Introduction</p>
          <p className="mt-8 font-serif text-3xl leading-snug text-forest sm:text-4xl lg:text-[2.8rem]">
            “Svarna” means <em className="text-gold">gold</em> — a symbol of what is precious, enduring and pure. Svarna Rituals is our tribute to the golden thread that links nature, tradition and modern care.
          </p>
        </Reveal>
      </section>

      {/* Story */}
      <section className="container-luxe grid items-center gap-14 pb-24 lg:grid-cols-2 lg:gap-24 lg:pb-32">
        <Reveal className="grid grid-cols-5 gap-4">
          <div className="col-span-3 aspect-[3/4] overflow-hidden rounded-[2rem]">
            <SmartImage src="img:lifestyle" alt="Hands holding an ivory cream jar" className="h-full w-full object-cover" />
          </div>
          <div className="col-span-2 mt-16 aspect-[3/5] overflow-hidden rounded-[2rem]">
            <SmartImage src="img:journal-garden" alt="Herb garden at golden hour" className="h-full w-full object-cover" />
          </div>
        </Reveal>
        <div>
          <SectionHeading align="left" eyebrow="Our Story" title="A ritual, not a routine" />
          <Reveal delay={100} className="mt-8 space-y-5 leading-relaxed text-muted-foreground">
            <p>Svarna Rituals Essentials Private Limited was incorporated in Mumbai in August 2026 with a simple belief: that caring for your skin can be a moment of calm, presence and connection with nature.</p>
            <p>We draw inspiration from the botanical traditions and self-care rituals passed down through generations — and pair that inspiration with the thoughtful, considered approach of modern skincare science.</p>
            <p>The result is a brand built around nature-inspired formulation concepts, a cruelty-free positioning, and objects designed to make daily care feel quietly luxurious.</p>
          </Reveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-forest-gradient py-24 text-ivory lg:py-32">
        <div className="container-luxe grid gap-6 md:grid-cols-2">
          {[
            { label: "Our Vision", title: "To make every day of skincare a mindful ritual.", text: "We envision a world where beauty is gentle, intentional and in harmony with nature — where self-care is a daily act of respect for oneself and the planet." },
            { label: "Our Mission", title: "To bridge botanical heritage and modern care.", text: "To create nature-inspired, cruelty-free skincare concepts that honour traditional wisdom, embrace modern skincare science and elevate everyday routines into rituals." },
          ].map((b, i) => (
            <Reveal key={b.label} delay={i * 120} className="rounded-[2rem] border border-ivory/15 bg-ivory/5 p-10 backdrop-blur lg:p-14">
              <p className="eyebrow">{b.label}</p>
              <h3 className="mt-6 text-3xl leading-snug sm:text-4xl">{b.title}</h3>
              <p className="mt-6 leading-relaxed text-ivory/70">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="container-luxe py-24 lg:py-32">
        <SectionHeading eyebrow="Brand Philosophy" title="Traditional wisdom meets modern skincare science" text="Our philosophy rests on four quiet principles that guide every concept, every object and every ritual." />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.homepage.philosophy.map((p, i) => (
            <Reveal key={p.id} delay={i * 90} className="rounded-2xl border bg-card p-8 transition hover:-translate-y-1 hover:shadow-soft">
              <span className="font-serif text-4xl text-gold">{p.eyebrow}</span>
              <h3 className="mt-4 text-2xl text-forest">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Nature-inspired & cruelty-free */}
      <section className="bg-secondary/60">
        <div className="container-luxe grid items-stretch gap-0 lg:grid-cols-2">
          <Reveal className="relative min-h-[420px] overflow-hidden lg:my-0">
            <SmartImage src="img:gallery-jasmine" alt="Frosted dropper bottle among jasmine flowers" className="absolute inset-0 h-full w-full object-cover" />
          </Reveal>
          <div className="flex flex-col justify-center py-20 lg:py-28 lg:pl-20">
            <SectionHeading align="left" eyebrow="Nature-inspired Beauty" title="Kind by intention" />
            <Reveal delay={100} className="mt-8 space-y-5 leading-relaxed text-muted-foreground">
              <p>Nature is our first teacher. The textures, colours and scents of the botanical world shape how we imagine every Svarna Rituals concept.</p>
              <p>We are committed to a <strong className="font-medium text-forest">cruelty-free brand positioning</strong> — beauty should never come at the cost of animals.</p>
            </Reveal>
            <Reveal delay={200}><Link to="/ingredients" className={buttonClass("primary", "md", "mt-10")}>Our Philosophy</Link></Reveal>
          </div>
        </div>
      </section>

      {/* Company overview */}
      <section className="container-luxe py-24 lg:py-32">
        <SectionHeading eyebrow="Company Overview" title="Corporate information" text="Details as supplied from the company's corporate records." />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {overview.map(({ Icon, label, value }, i) => (
            <Reveal key={label} delay={i * 60} className={`rounded-2xl border bg-card p-7 ${label === "Business Activity" || label === "Registered Office" ? "sm:col-span-2" : ""}`}>
              <Icon className="h-5 w-5 text-gold" strokeWidth={1.4} />
              <p className="mt-5 text-[0.62rem] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
              <p className="mt-2 font-serif text-xl leading-snug text-forest">{value}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
