import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/ui-luxe/SmartImage";
import { buttonClass } from "@/components/ui-luxe/button";
import { Modal } from "@/components/ui-luxe/Modal";

export function CartDrawer() {
  const { cart, data, cartOpen, setCartOpen, setQty, removeFromCart, cartSubtotal, cartCount, clearCart } = useStore();
  const [checkout, setCheckout] = useState(false);

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [cartOpen, setCartOpen]);

  const lines = cart
    .map((i) => ({ ...i, product: data.products.find((p) => p.id === i.productId) }))
    .filter((l) => l.product);

  return (
    <>
      <div className={cn("fixed inset-0 z-[70]", cartOpen ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!cartOpen}>
        <div className={cn("absolute inset-0 bg-forest-deep/50 backdrop-blur-sm transition-opacity duration-500", cartOpen ? "opacity-100" : "opacity-0")} onClick={() => setCartOpen(false)} />
        <aside
          role="dialog"
          aria-label="Shopping bag"
          className={cn("absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-lift transition-transform duration-500 ease-out", cartOpen ? "translate-x-0" : "translate-x-full")}
        >
          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <p className="eyebrow">Your Bag</p>
              <h3 className="mt-1 text-3xl text-forest">{cartCount} {cartCount === 1 ? "item" : "items"}</h3>
            </div>
            <button onClick={() => setCartOpen(false)} aria-label="Close bag" className="rounded-full p-2 text-forest hover:bg-secondary">
              <X className="h-5 w-5" />
            </button>
          </div>

          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                <ShoppingBag className="h-8 w-8 text-gold" strokeWidth={1.2} />
              </div>
              <h4 className="text-3xl text-forest">Your bag is empty</h4>
              <p className="mt-3 text-sm text-muted-foreground">Discover botanical rituals crafted with intention.</p>
              <Link to="/collections" onClick={() => setCartOpen(false)} className={buttonClass("primary", "md", "mt-8")}>
                Explore Collection
              </Link>
            </div>
          ) : (
            <>
              <ul className="flex-1 divide-y overflow-y-auto px-6">
                {lines.map(({ product, qty }) =>
                  product ? (
                    <li key={product.id} className="flex gap-4 py-5 animate-fade-up">
                      <Link to="/product/$id" params={{ id: product.id }} onClick={() => setCartOpen(false)} className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
                        <SmartImage src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <Link to="/product/$id" params={{ id: product.id }} onClick={() => setCartOpen(false)} className="font-serif text-lg leading-tight text-forest hover:text-gold">
                            {product.name}
                          </Link>
                          <button onClick={() => removeFromCart(product.id)} aria-label={`Remove ${product.name}`} className="h-fit rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">{product.size}</p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-full border">
                            <button onClick={() => setQty(product.id, qty - 1)} aria-label="Decrease quantity" className="p-2 text-forest hover:text-gold"><Minus className="h-3.5 w-3.5" /></button>
                            <span className="w-7 text-center text-sm">{qty}</span>
                            <button onClick={() => setQty(product.id, qty + 1)} aria-label="Increase quantity" className="p-2 text-forest hover:text-gold"><Plus className="h-3.5 w-3.5" /></button>
                          </div>
                          <span className="font-medium text-forest">{formatINR(product.price * qty)}</span>
                        </div>
                      </div>
                    </li>
                  ) : null,
                )}
              </ul>
              <div className="border-t bg-secondary/50 px-6 py-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Subtotal</span>
                  <span className="font-serif text-3xl text-forest">{formatINR(cartSubtotal)}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Illustrative prices · Demo bag — no payment is processed.</p>
                <button onClick={() => setCheckout(true)} className={buttonClass("primary", "lg", "mt-5 w-full")}>Proceed to Checkout</button>
                <button onClick={() => setCartOpen(false)} className="mt-3 w-full text-center text-xs uppercase tracking-[0.2em] text-forest underline-offset-4 hover:underline">
                  Continue shopping
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
      <Modal open={checkout} onClose={() => setCheckout(false)} title="Demo checkout" size="sm"
        footer={
          <>
            <button className={buttonClass("outline", "sm")} onClick={() => setCheckout(false)}>Keep bag</button>
            <button className={buttonClass("primary", "sm")} onClick={() => { clearCart(); setCheckout(false); setCartOpen(false); }}>Clear bag</button>
          </>
        }
      >
        <div className="p-6 text-sm leading-relaxed text-muted-foreground">
          This is a frontend demonstration. Online ordering and payments are not yet available, and no order has been placed.
          Your bag subtotal is <span className="font-medium text-forest">{formatINR(cartSubtotal)}</span>.
        </div>
      </Modal>
    </>
  );
}
