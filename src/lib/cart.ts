import type { Product } from "./types";
import { ADMIN_CREDENTIALS } from "./mock-data";

export interface CartItem {
  productId: string;
  qty: number;
}

export const MAX_QTY = 10;

export function addItem(items: CartItem[], productId: string, qty = 1): CartItem[] {
  const existing = items.find((i) => i.productId === productId);
  if (existing) {
    return items.map((i) =>
      i.productId === productId ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i,
    );
  }
  return [...items, { productId, qty: Math.min(MAX_QTY, Math.max(1, qty)) }];
}

export function setItemQty(items: CartItem[], productId: string, qty: number): CartItem[] {
  if (qty <= 0) return items.filter((i) => i.productId !== productId);
  return items.map((i) => (i.productId === productId ? { ...i, qty: Math.min(MAX_QTY, qty) } : i));
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function cartSubtotal(items: CartItem[], products: Product[]): number {
  return items.reduce((sum, i) => {
    const p = products.find((x) => x.id === i.productId);
    return p ? sum + p.price * i.qty : sum;
  }, 0);
}

export function canPurchase(p: Product): boolean {
  return p.availability === "in-stock" || p.availability === "low-stock";
}

export function checkAdminCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password
  );
}
