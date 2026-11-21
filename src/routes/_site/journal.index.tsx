import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Clock, Search, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/site/PageHero";
import { SmartImage } from "@/components/ui-luxe/SmartImage";
import { Reveal } from "@/components/ui-luxe/Reveal";
import { buttonClass } from "@/components/ui-luxe/button";
import { NewsletterForm } from "@/components/site/NewsletterForm";

export const Route = createFileRoute("/_site/journal/")({
  head: () => ({
    meta: [
      { title: "The Journal — Svarna Rituals" },
      { name: "description", content: "Stories on rituals, botanicals, wellness and skincare education from the Svarna Rituals journal." },
      { property: "og:title", content: "The Journal — Svarna Rituals" },
      { property: "og:description", content: "Notes on ritual, nature and mindful skincare." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  const { data } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const published = useMemo(() => data.articles.filter((a) => a.published).sort((a, b) => b.date.localeCompare(a.date)), [data.articles]);
  const featured = published.find((a) => a.featured) ?? published[0];
  const filtered = published.filter((a) => {
    if (cat && a.categoryId !== cat) return false;
    const term = q.trim().toLowerCase();
    return !term || `${a.title} ${a.excerpt} ${a.content}`.toLowerCase().includes(term);
  });
  const catName = (id: string) => data.journalCategories.find((c) => c.id === id)?.name ?? "Journal";
  const chip = (active: boolean) => cn("whitespace-nowrap rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] transition", active ? "border-forest bg-forest text-ivory" : "bg-card text-forest hover:border-forest/50");

  return (
    <>
      <PageHero eyebrow="The Journal" title={<>Notes on ritual <em className="text-gold-soft">&amp; nature</em></>} text="Stories, reflections and gentle guides from the world of Svarna Rituals." image="img:journal-tea" imageAlt="Herbal tea beside an open journal" />

      {featured && !q && !cat && (
        <section className="container-luxe py-16 lg:py-24">
          <Reveal>
            <Link to="/journal/$id" params={{ id: featured.id }} className="group grid overflow-hidden rounded-[2rem] bg-card shadow-soft lg:grid-cols-2">
              <div className="aspect-[4/3] overflow-hidden lg:aspect-auto">
                <SmartImage src={featured.image} alt={featured.title} className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                <p className="eyebrow">Featured · {catName(featured.categoryId)}</p>
                <h2 className="mt-5 text-4xl text-forest transition group-hover:text-gold sm:text-5xl">{featured.title}</h2>
                <p className="mt-5 leading-relaxed text-muted-foreground">{featured.excerpt}</p>
                <p className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {formatDate(featured.date)} <span className="h-1 w-1 rounded-full bg-gold" /> <Clock className="h-3.5 w-3.5" /> {featured.readTime} min read
                </p>
                <span className={buttonClass("primary", "md", "mt-8 w-fit")}>Read Article <ArrowRight className="h-4 w-4" /></span>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      <section className="container-luxe pb-24 pt-4">
        <div className="flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            <button onClick={() => setCat(null)} className={chip(!cat)}>All</button>
            {data.journalCategories.map((c) => <button key={c.id} onClick={() => setCat(c.id)} className={chip(cat === c.id)}>{c.name}</button>)}
          </div>
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…" aria-label="Search articles" className="h-11 w-full rounded-full border bg-card pl-11 pr-10 text-sm outline-none focus:border-gold" />
            {q && <button onClick={() => setQ("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><X className="h-4 w-4" /></button>}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-12 rounded-[2rem] border border-dashed py-20 text-center">
            <h3 className="text-3xl text-forest">No articles found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Try another search or category.</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => (
              <Reveal key={a.id} delay={(i % 3) * 90}>
                <article className="group">
                  <Link to="/journal/$id" params={{ id: a.id }} className="block overflow-hidden rounded-2xl">
                    <SmartImage src={a.image} alt={a.title} className="aspect-[4/3] w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
                  </Link>
                  <p className="mt-5 text-[0.62rem] uppercase tracking-[0.25em] text-gold">{catName(a.categoryId)} · {formatDate(a.date)}</p>
                  <Link to="/journal/$id" params={{ id: a.id }}><h3 className="mt-3 text-2xl leading-snug text-forest transition group-hover:text-gold">{a.title}</h3></Link>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
                  <Link to="/journal/$id" params={{ id: a.id }} className="link-underline mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-forest">Read More <ArrowRight className="h-3.5 w-3.5" /></Link>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="bg-beige/50 py-20">
        <div className="container-luxe mx-auto max-w-2xl text-center">
          <p className="eyebrow">Stay inspired</p>
          <h2 className="mt-4 text-4xl text-forest">New stories, gently delivered</h2>
          <div className="mt-8"><NewsletterForm source="Journal" /></div>
        </div>
      </section>
    </>
  );
}
