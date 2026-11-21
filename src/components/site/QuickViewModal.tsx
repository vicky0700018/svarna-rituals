import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { useStore } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { canPurchase } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui-luxe/Modal";
import { SmartImage } from "@/components/ui-luxe/SmartImage";
import { buttonClass } from "@/components/ui-luxe/button";
import { DemoBadge } from "@/components/ui-luxe/DemoBadge";
import { AVAILABILITY } from "./availability";

export function QuickViewModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { data, addToCart, toast, wishlist, toggleWishlist } = useStore();
  const [qty, setQty] = useState(1);
  if (!product) return <Modal open={false} onClose={onClose}>{null}</Modal>;
  const category = data.categories.find((c) => c.id === product.categoryId);
  const avail = AVAILABILITY[product.availability];
  const wished = wishlist.includes(product.id);

  return (
    <Modal open={!!product} onClose={() => { setQty(1); onClose(); }} size="lg">
      <div className="grid md:grid-cols-2">
        <div className="aspect-[4/5] bg-secondary md:aspect-auto md:h-full">
          <SmartImage src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col p-7 sm:p-9">
          <div className="flex items-center gap-2">
            <p className="eyebrow">{category?.name}</p>
            <DemoBadge />
          </div>
          <h3 className="mt-4 text-4xl text-forest">{product.name}</h3>
          <p className="mt-3 font-serif text-3xl text-forest">{formatINR(product.price)} <span className="font-sans text-sm text-muted-foreground">· {product.size}</span></p>
          <p className="mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className={cn("h-2 w-2 rounded-full", avail.dot)} /> {avail.label}
          </p>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" className="p-3 text-forest"><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase" className="p-3 text-forest"><Plus className="h-4 w-4" /></button>
            </div>
            <button onClick={() => toggleWishlist(product.id)} aria-label="Toggle wishlist" className="flex h-12 w-12 items-center justify-center rounded-full border text-forest hover:border-gold">
              <Heart className={cn("h-4 w-4", wished && "fill-gold text-gold")} />
            </button>
          </div>
          <button
            disabled={!canPurchase(product)}
            onClick={() => { addToCart(product.id, qty); toast(`${product.name} added to your bag`); setQty(1); onClose(); }}
            className={buttonClass("primary", "lg", "mt-6 w-full")}
          >
            {canPurchase(product) ? "Add to Bag" : avail.label}
          </button>
          <Link to="/product/$id" params={{ id: product.id }} onClick={onClose} className="mt-4 text-center text-xs uppercase tracking-[0.22em] text-forest underline-offset-4 hover:underline">
            View full details
          </Link>
        </div>
      </div>
    </Modal>
  );
}
