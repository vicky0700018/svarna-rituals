import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

type NavItem = {
  label: string;
  to: "/" | "/about" | "/collections" | "/ingredients" | "/journal" | "/contact";
  match: (p: string) => boolean;
  children?: { label: string; to: "/ingredients" | "/rituals"; text: string }[];
};

const NAV: NavItem[] = [
  { label: "Home", to: "/", match: (p) => p === "/" },
  { label: "About", to: "/about", match: (p) => p.startsWith("/about") },
  { label: "Collections", to: "/collections", match: (p) => p.startsWith("/collections") || p.startsWith("/product") },
  {
    label: "Our Philosophy",
    to: "/ingredients",
    match: (p) => p.startsWith("/ingredients") || p.startsWith("/rituals"),
    children: [
      { label: "Ingredients & Philosophy", to: "/ingredients", text: "Botanical inspiration & modern science" },
      { label: "Our Rituals", to: "/rituals", text: "Morning & evening ritual concepts" },
    ],
  },
  { label: "Journal", to: "/journal", match: (p) => p.startsWith("/journal") },
  { label: "Contact", to: "/contact", match: (p) => p.startsWith("/contact") },
];

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { cartCount, setCartOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled ? "border-b bg-background/90 shadow-soft backdrop-blur-xl" : "bg-background/70 backdrop-blur-md",
      )}
    >
      <div className={cn("container-luxe flex items-center justify-between transition-all duration-500", scrolled ? "h-16" : "h-20")}>
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {NAV.map((item) => {
            const active = item.match(pathname);
            if (item.children) {
              return (
                <div key={item.label} className="group relative">
                  <Link
                    to={item.to}
                    data-status={active ? "active" : undefined}
                    className={cn("link-underline flex items-center gap-1 text-[0.72rem] uppercase tracking-[0.2em] transition-colors", active ? "text-forest font-medium" : "text-charcoal/75 hover:text-forest")}
                  >
                    {item.label}
                    <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 translate-y-3 pt-4 opacity-0 transition-all duration-400 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="rounded-2xl border bg-card p-2 shadow-lift">
                      {item.children.map((c) => (
                        <Link key={c.to} to={c.to} className={cn("block rounded-xl px-4 py-3 transition hover:bg-secondary", pathname.startsWith(c.to) && "bg-secondary")}>
                          <span className="block font-serif text-lg text-forest">{c.label}</span>
                          <span className="block text-xs text-muted-foreground">{c.text}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.to}
                data-status={active ? "active" : undefined}
                className={cn("link-underline text-[0.72rem] uppercase tracking-[0.2em] transition-colors", active ? "text-forest font-medium" : "text-charcoal/75 hover:text-forest")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCartOpen(true)}
            className="relative rounded-full p-2.5 text-forest transition hover:bg-secondary"
            aria-label={`Open shopping bag, ${cartCount} items`}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.4} />
            {cartCount > 0 && (
              <span key={cartCount} className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[0.62rem] font-semibold text-forest-deep animate-pop-in">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-full p-2.5 text-forest transition hover:bg-secondary lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.4} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("fixed inset-0 z-[60] lg:hidden", mobileOpen ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!mobileOpen}>
        <div className={cn("absolute inset-0 bg-forest-deep/50 backdrop-blur-sm transition-opacity duration-500", mobileOpen ? "opacity-100" : "opacity-0")} onClick={() => setMobileOpen(false)} />
        <aside className={cn("absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-forest-gradient text-ivory transition-transform duration-500 ease-out", mobileOpen ? "translate-x-0" : "translate-x-full")}>
          <div className="flex items-center justify-between px-6 py-5">
            <Logo tone="light" />
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="rounded-full p-2 hover:bg-ivory/10">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="gold-rule mx-6 opacity-60" />
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 py-8" aria-label="Mobile">
            {NAV.map((item) => (
              <div key={item.label}>
                <Link to={item.to} className={cn("block py-3 font-serif text-3xl transition", item.match(pathname) ? "text-gold" : "text-ivory/90 hover:text-gold")}>
                  {item.label}
                </Link>
                {item.children && (
                  <div className="mb-2 ml-1 flex flex-col gap-1 border-l border-ivory/20 pl-4">
                    {item.children.map((c) => (
                      <Link key={c.to} to={c.to} className={cn("py-1.5 text-sm uppercase tracking-[0.18em]", pathname.startsWith(c.to) ? "text-gold" : "text-ivory/70")}>
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <p className="px-6 pb-8 text-xs uppercase tracking-[0.25em] text-ivory/50">Nature-inspired · Cruelty-free</p>
        </aside>
      </div>
    </header>
  );
}
