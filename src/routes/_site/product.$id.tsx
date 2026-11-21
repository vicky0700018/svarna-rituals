import { Link, createFileRoute } from "@tanstack/react-router";
import { useState, type MouseEvent } from "react";
import { ChevronDown, ChevronRight, Heart, Leaf, Minus, Plus, Rabbit, ShoppingBag, Truck } from "lucide-react";
import { useStore } from "@/lib/store";
import { DEFAULT_DATA } from "@/lib/mock-data";
import { formatINR } from "@/lib/format";
import { canPurchase } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/ui-luxe/SmartImage";
import { buttonClass } from "@/components/ui-luxe/button";
import { DemoBadge } from "@/components/ui-luxe/DemoBadge";
import { Reveal } from "@/components/ui-luxe/Reveal";
import { SectionHeading } from "@/components/ui-luxe/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";
import { AVAILABILITY } from "@/components/site/availability";

export const Route = createFileRoute("/_site/product/$id")({
  head: ({ params }) => {
    const p = DEFAULT_DATA.products.find((x) => x.id === params.id);
    const title = p ? `${p.name} — Svarna Rituals` : "Product — Svarna Rituals";
    const desc = p ? p.short : "Explore botanical skincare from Svarna Rituals.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between py-5 text-left">
        <span className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-forest">{title}</span>
        <ChevronDown className={cn("h-4 w-4 text-gold transition-transform duration-300", open && "rotate-180")} />
      </button>
      <div className={cn("grid transition-all duration-500", open ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden text-sm leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

function ProductPage() {
  const { id } = Route.useParams();
  const { data, addToCart, toast, wishlist, toggleWishlist } = useStore();
  const product = data.products.find((p) => p.id === id && p.published);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  if (!product) {
    return (
      <section className="container-luxe flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <Leaf className="h-10 w-10 text-gold" strokeWidth={1.1} />
        <h1 className="mt-6 text-5xl text-forest">Product not found</h1>
        <p className="mt-3 text-muted-foreground">This product may have been moved or is no longer available.</p>
        <Link to="/collections" className={buttonClass("primary", "md", "mt-8")}>Back to Collection</Link>
      </section>
    );
  }

  const category = data.categories.find((c) => c.id === product.categoryId);
  const avail = AVAILABILITY[product.availability];
  const images = product.gallery.length ? product.gallery : [product.image];
  const current = images[Math.min(active, images.length - 1)];
  const wished = wishlist.includes(product.id);
  const purchasable = canPurchase(product);
  const related = [
    ...data.products.filter((p) => p.published && p.id !== product.id && p.categoryId === product.categoryId),
    ...data.products.filter((p) => p.published && p.id !== product.id && p.categoryId !== product.categoryId),
  ].slice(0, 4);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <>
      <div className="container-luxe pt-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[0.66rem] uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/" className="hover:text-forest">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/collections" className="hover:text-forest">Collection</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/collections" search={{ category: product.categoryId }} className="hover:text-forest">{category?.name}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-forest">{product.name}</span>
        </nav>
      </div>

      <section className="container-luxe grid gap-12 py-10 lg:grid-cols-2 lg:gap-20 lg:py-14">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row lg:sticky lg:top-24 lg:self-start">
          <div className="flex gap-3 sm:flex-col">
            {images.map((img, i) => (
              <button
                key={`${img}-${i}`}
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={cn("h-20 w-16 overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-20", i === active ? "border-gold" : "border-transparent opacity-70 hover:opacity-100")}
              >
                <SmartImage src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div
            className="relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden rounded-[2rem] bg-secondary"
            onMouseMove={onMove}
            onMouseLeave={() => setZoom(null)}
          >
            <SmartImage
              key={current}
              src={current}
              alt={product.name}
              loading="eager"
              className="h-full w-full object-cover transition-transform duration-300 animate-in fade-in"
              style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
            <DemoBadge className="absolute left-4 top-4" />
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="eyebrow">{category?.name}</p>
          <h1 className="mt-4 text-5xl text-forest sm:text-6xl">{product.name}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <span className="font-serif text-4xl text-forest">{formatINR(product.price)}</span>
            <span className="text-sm text-muted-foreground">{product.size}</span>
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-forest">
              <span className={cn("h-2 w-2 rounded-full", avail.dot)} /> {avail.label}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Illustrative price · inclusive of all taxes (demo)</p>
          <div className="gold-rule my-8" />
          <p className="text-lg leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border bg-card">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="p-4 text-forest hover:text-gold"><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center font-medium" aria-live="polite">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase quantity" className="p-4 text-forest hover:text-gold"><Plus className="h-4 w-4" /></button>
            </div>
            <button
              onClick={() => {
                if (!purchasable) { toast(`${product.name} is ${avail.label.toLowerCase()}.`, "info"); return; }
                addToCart(product.id, qty);
                toast(`${qty} × ${product.name} added to your bag`);
              }}
              className={buttonClass("primary", "lg", "flex-1")}
            >
              <ShoppingBag className="h-4 w-4" /> {purchasable ? "Add to Bag" : avail.label}
            </button>
            <button onClick={() => toggleWishlist(product.id)} aria-label="Toggle wishlist" aria-pressed={wished} className="flex h-14 w-14 items-center justify-center rounded-full border bg-card text-forest transition hover:border-gold">
              <Heart className={cn("h-5 w-5", wished && "fill-gold text-gold")} />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {[
              { Icon: Leaf, t: "Nature-inspired" },
              { Icon: Rabbit, t: "Cruelty-free positioning" },
              { Icon: Truck, t: "Delivery details soon" },
            ].map(({ Icon, t }) => (
              <div key={t} className="rounded-2xl bg-secondary/70 px-2 py-4">
                <Icon className="mx-auto h-5 w-5 text-gold" strokeWidth={1.3} />
                <p className="mt-2 text-[0.6rem] uppercase tracking-[0.16em] text-forest">{t}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t">
            <Accordion title="Product Information" defaultOpen>
              <dl className="grid grid-cols-2 gap-y-2">
                <dt>Category</dt><dd className="text-forest">{category?.name}</dd>
                <dt>Size</dt><dd className="text-forest">{product.size}</dd>
                <dt>Availability</dt><dd className="text-forest">{avail.label}</dd>
                <dt>Status</dt><dd className="text-forest">Illustrative demo product</dd>
              </dl>
            </Accordion>
            <Accordion title="Ingredients">
              <p>Full ingredient list will be published here once formulation details are confirmed by Svarna Rituals.</p>
            </Accordion>
            <Accordion title="How to Use">
              <p>Usage instructions will be added here once product details are finalised. Always follow the directions on the final product packaging.</p>
            </Accordion>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-secondary/60 py-20 lg:py-28">
          <div className="container-luxe">
            <SectionHeading eyebrow="Complete the Ritual" title="You may also like" />
            <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => <Reveal key={p.id} delay={i * 80}><ProductCard product={p} /></Reveal>)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
