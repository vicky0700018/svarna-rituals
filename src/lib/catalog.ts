import type { Product } from "./types";

export type Sort = "featured" | "price-asc" | "price-desc" | "newest" | "name";
export const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name A–Z" },
];

export function filterProducts(
  products: Product[],
  opts: { q?: string | undefined; category?: string | undefined; sort?: Sort | undefined; featuredOnly?: boolean; wishlist?: string[] | null },
): Product[] {
  const q = (opts.q ?? "").trim().toLowerCase();
  let list = products.filter((p) => p.published);
  if (opts.category) list = list.filter((p) => p.categoryId === opts.category);
  if (q) list = list.filter((p) => `${p.name} ${p.short} ${p.description}`.toLowerCase().includes(q));
  if (opts.featuredOnly) list = list.filter((p) => p.featured);
  if (opts.wishlist) list = list.filter((p) => opts.wishlist?.includes(p.id));
  const sorted = [...list];
  switch (opts.sort ?? "featured") {
    case "price-asc": sorted.sort((a, b) => a.price - b.price); break;
    case "price-desc": sorted.sort((a, b) => b.price - a.price); break;
    case "newest": sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
    case "name": sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
  return sorted;
}

