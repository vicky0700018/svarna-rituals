import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Clock, Share2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { DEFAULT_DATA } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { SmartImage } from "@/components/ui-luxe/SmartImage";
import { Reveal } from "@/components/ui-luxe/Reveal";
import { buttonClass } from "@/components/ui-luxe/button";

export const Route = createFileRoute("/_site/journal/$id")({
  head: ({ params }) => {
    const a = DEFAULT_DATA.articles.find((x) => x.id === params.id);
    const title = a ? `${a.title} — Svarna Rituals Journal` : "Journal — Svarna Rituals";
    const desc = a ? a.excerpt : "Stories from the Svarna Rituals journal.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { id } = Route.useParams();
  const { data, toast } = useStore();
  const article = data.articles.find((a) => a.id === id && a.published);

  if (!article) {
    return (
      <section className="container-luxe flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <h1 className="text-5xl text-forest">Article not found</h1>
        <p className="mt-3 text-muted-foreground">This story may have been moved or unpublished.</p>
        <Link to="/journal" className={buttonClass("primary", "md", "mt-8")}>Back to Journal</Link>
      </section>
    );
  }

  const cat = data.journalCategories.find((c) => c.id === article.categoryId);
  const related = data.articles
    .filter((a) => a.published && a.id !== article.id)
    .sort((a, b) => Number(b.categoryId === article.categoryId) - Number(a.categoryId === article.categoryId))
    .slice(0, 3);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Article link copied");
    } catch {
      toast("Could not copy the link", "error");
    }
  };

  return (
    <>
      <article>
        <header className="container-luxe max-w-4xl pb-10 pt-14 text-center lg:pt-20">
          <Link to="/journal" className="inline-flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.22em] text-muted-foreground hover:text-forest">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Journal
          </Link>
          <p className="eyebrow mt-10">{cat?.name}</p>
          <h1 className="mt-5 text-5xl text-forest text-balance-luxe sm:text-6xl">{article.title}</h1>
          <p className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {article.author} <span className="h-1 w-1 rounded-full bg-gold" /> {formatDate(article.date)} <span className="h-1 w-1 rounded-full bg-gold" /> <Clock className="h-3.5 w-3.5" /> {article.readTime} min read
          </p>
        </header>
        <div className="container-luxe">
          <div className="overflow-hidden rounded-[2rem]">
            <SmartImage src={article.image} alt={article.title} loading="eager" className="aspect-[16/9] w-full object-cover sm:aspect-[21/9]" />
          </div>
        </div>
        <div className="container-luxe max-w-3xl py-16">
          <p className="font-serif text-2xl leading-relaxed text-forest">{article.excerpt}</p>
          <div className="gold-rule my-10" />
          <div className="space-y-6 text-lg leading-[1.85] text-charcoal/85">
            {article.content.split(/\n\s*\n/).map((para, i) => <p key={i}>{para}</p>)}
          </div>
          <div className="mt-12 flex items-center justify-between border-t pt-6">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Sample editorial content</span>
            <button onClick={share} className={buttonClass("outline", "sm")}><Share2 className="h-3.5 w-3.5" /> Share</button>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-secondary/60 py-20">
          <div className="container-luxe">
            <h2 className="text-center text-4xl text-forest sm:text-5xl">Related articles</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {related.map((a, i) => (
                <Reveal key={a.id} delay={i * 90}>
                  <Link to="/journal/$id" params={{ id: a.id }} className="group block">
                    <div className="overflow-hidden rounded-2xl">
                      <SmartImage src={a.image} alt={a.title} className="aspect-[4/3] w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
                    </div>
                    <p className="mt-4 text-[0.62rem] uppercase tracking-[0.25em] text-gold">{formatDate(a.date)}</p>
                    <h3 className="mt-2 text-2xl text-forest transition group-hover:text-gold">{a.title}</h3>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
