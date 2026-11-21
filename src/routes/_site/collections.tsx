import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { SORTS, filterProducts, type Sort } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { QuickViewModal } from "@/components/site/QuickViewModal";
import { ProductCardSkeleton } from "@/components/ui-luxe/Skeleton";
import { Reveal } from "@/components/ui-luxe/Reveal";


interface CollectionSearch {
  q?: string;
  category?: string;
  sort?: Sort;
}

export const Route = createFileRoute("/_site/collections")({
  validateSearch: (search: Record<string, unknown>): CollectionSearch => {
    const out: CollectionSearch = {};
    if (typeof search["q"] === "string" && search["q"]) out.q = search["q"];
    if (typeof search["category"] === "string" && search["category"]) out.category = search["category"];
    if (typeof search["sort"] === "string" && SORTS.some((s) => s.value === search["sort"])) out.sort = search["sort"] as Sort;
    return out;
  },
  head: () => ({
    meta: [
      { title: "Our Collection — Svarna Rituals" },
      { name: "description", content: "Browse the Svarna Rituals botanical skincare collection — face oils, serums, creams, mists, masks and body care." },
      { property: "og:title", content: "Our Collection — Svarna Rituals" },
      { property: "og:description", content: "Botanical skincare and body care, presented as an illustrative preview collection." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  const { data, ready, wishlist } = useStore();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/collections" });
  const [quick, setQuick] = useState<Product | null>(null);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [wishOnly, setWishOnly] = useState(false);

  const setSearch = (patch: Partial<CollectionSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });

  const products = useMemo(
    () => filterProducts(data.products, { ...search, featuredOnly, wishlist: wishOnly ? wishlist : null }),
    [data.products, search, featuredOnly, wishOnly, wishlist],
  );

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    data.products.filter((p) => p.published).forEach((p) => { m[p.categoryId] = (m[p.categoryId] ?? 0) + 1; });
    return m;
  }, [data.products]);

  const activeCategory = data.categories.find((c) => c.id === search.category);
  const chip = (active: boolean) =>
    cn("whitespace-nowrap rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] transition", active ? "border-forest bg-forest text-ivory" : "border-border bg-card text-forest hover:border-forest/50");

  return (
    <>
      <PageHero
        eyebrow="Our Collection"
        title={activeCategory ? activeCategory.name : <>The <em className="text-gold-soft">Svarna</em> Collection</>}
        text={activeCategory ? activeCategory.description : "Botanical-inspired skincare and body care, crafted as objects of daily ritual."}
        image="img:collection"
        imageAlt="Flat lay of green glass and ivory skincare bottles with gold caps"
      />

      <section className="container-luxe py-14 lg:py-20">
        <div className="rounded-2xl border border-gold/40 bg-gold/10 px-5 py-3 text-center text-xs uppercase tracking-[0.2em] text-forest">
          Preview collection — all products, prices and availability are illustrative demo content
        </div>

        {/* Toolbar */}
        <div className="sticky top-16 z-30 -mx-5 mt-8 border-b bg-background/90 px-5 py-4 backdrop-blur-xl md:-mx-10 md:px-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search.q ?? ""}
                onChange={(e) => setSearch({ q: e.target.value || undefined })}
                placeholder="Search products…"
                aria-label="Search products"
                className="h-11 w-full rounded-full border bg-card pl-11 pr-10 text-sm outline-none transition focus:border-gold"
              />
              {search.q && (
                <button onClick={() => setSearch({ q: undefined })} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-forest">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => setFeaturedOnly((v) => !v)} className={chip(featuredOnly)} aria-pressed={featuredOnly}>
                <Sparkles className="mr-1.5 inline h-3 w-3" /> Featured
              </button>
              <button onClick={() => setWishOnly((v) => !v)} className={chip(wishOnly)} aria-pressed={wishOnly}>
                <Heart className="mr-1.5 inline h-3 w-3" /> Wishlist ({wishlist.length})
              </button>
              <label className="flex items-center gap-2 rounded-full border bg-card pl-4 pr-2 text-[0.68rem] uppercase tracking-[0.18em] text-forest">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <select
                  value={search.sort ?? "featured"}
                  onChange={(e) => setSearch({ sort: e.target.value as Sort })}
                  aria-label="Sort products"
                  className="h-10 cursor-pointer bg-transparent pr-2 text-[0.68rem] uppercase tracking-[0.12em] outline-none"
                >
                  {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            <button onClick={() => setSearch({ category: undefined })} className={chip(!search.category)}>All ({data.products.filter((p) => p.published).length})</button>
            {data.categories.map((c) => (
              <button key={c.id} onClick={() => setSearch({ category: c.id })} className={chip(search.category === c.id)}>
                {c.name} ({counts[c.id] ?? 0})
              </button>
            ))}
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">{products.length} {products.length === 1 ? "product" : "products"}</p>

        {!ready ? (
          <div className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-[2rem] border border-dashed py-24 text-center">
            <Search className="h-8 w-8 text-gold" strokeWidth={1.2} />
            <h3 className="mt-5 text-3xl text-forest">No products found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Try a different search or category.</p>
            <button onClick={() => { setFeaturedOnly(false); setWishOnly(false); navigate({ search: {}, replace: true }); }} className="mt-6 text-xs uppercase tracking-[0.2em] text-forest underline underline-offset-4">Clear all filters</button>
          </div>
        ) : (
          <div className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 70}><ProductCard product={p} onQuickView={setQuick} /></Reveal>
            ))}
          </div>
        )}
      </section>
      <QuickViewModal product={quick} onClose={() => setQuick(null)} />
    </>
  );
}
