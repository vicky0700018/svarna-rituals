import { Link } from "@tanstack/react-router";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useStore } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { canPurchase } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/ui-luxe/SmartImage";
import { buttonClass } from "@/components/ui-luxe/button";
import { DemoBadge } from "@/components/ui-luxe/DemoBadge";
import { AVAILABILITY } from "./availability";

interface Props {
  product: Product;
  onQuickView?: (p: Product) => void;
  tone?: "light" | "dark";
}

export function ProductCard({ product, onQuickView, tone = "light" }: Props) {
  const { data, addToCart, wishlist, toggleWishlist, toast } = useStore();
  const category = data.categories.find((c) => c.id === product.categoryId);
  const wished = wishlist.includes(product.id);
  const avail = AVAILABILITY[product.availability];
  const hoverImage = product.gallery.find((g) => g !== product.image);
  const purchasable = canPurchase(product);

  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
        <Link to="/product/$id" params={{ id: product.id }} className="block h-full w-full" aria-label={product.name}>
          <SmartImage src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110" />
          {hoverImage && (
            <SmartImage src={hoverImage} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          )}
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-forest backdrop-blur">
            <span className={cn("h-1.5 w-1.5 rounded-full", avail.dot)} />
            {avail.label}
          </span>
          <DemoBadge />
        </div>
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wished}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 text-forest backdrop-blur transition hover:scale-110"
        >
          <Heart className={cn("h-4 w-4 transition", wished && "fill-gold text-gold")} />
        </button>
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 rounded-full bg-card/95 py-3 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-forest opacity-0 shadow-soft backdrop-blur transition-all duration-500 hover:bg-forest hover:text-ivory group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
          >
            <Eye className="h-4 w-4" /> Quick View
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <p className="text-[0.62rem] font-medium uppercase tracking-[0.25em] text-gold">{category?.name ?? "Uncategorised"}</p>
        <Link to="/product/$id" params={{ id: product.id }}>
          <h3 className={cn("mt-2 text-2xl leading-tight transition-colors hover:text-gold", tone === "light" ? "text-forest" : "text-ivory")}>{product.name}</h3>
        </Link>
        <p className={cn("mt-2 line-clamp-2 text-sm leading-relaxed", tone === "light" ? "text-muted-foreground" : "text-ivory/70")}>{product.short}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <span className={cn("font-serif text-2xl", tone === "light" ? "text-forest" : "text-ivory")}>{formatINR(product.price)}</span>
            <span className={cn("ml-2 text-xs", tone === "light" ? "text-muted-foreground" : "text-ivory/60")}>{product.size}</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link to="/product/$id" params={{ id: product.id }} className={buttonClass(tone === "light" ? "outline" : "lightOutline", "sm", "w-full px-2")}>
            View Details
          </Link>
          <button
            onClick={() => {
              if (!purchasable) {
                toast(`${product.name} is ${avail.label.toLowerCase()} — we'll share updates soon.`, "info");
                return;
              }
              addToCart(product.id);
              toast(`${product.name} added to your bag`);
            }}
            className={buttonClass(tone === "light" ? "primary" : "gold", "sm", "w-full px-2")}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {purchasable ? "Add to Bag" : avail.label}
          </button>
        </div>
      </div>
    </article>
  );
}
