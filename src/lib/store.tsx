import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DEFAULT_DATA } from "./mock-data";
import type { Activity, CollectionKey, HomepageSettings, SiteData, SiteSettings } from "./types";
import { addItem, cartCount, cartSubtotal, checkAdminCredentials, setItemQty, type CartItem } from "./cart";
import { uid } from "./format";

const KEYS = {
  data: "svarna:data:v1",
  cart: "svarna:cart:v1",
  wishlist: "svarna:wishlist:v1",
  admin: "svarna:admin:v1",
};

export type ToastType = "success" | "error" | "info";
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

type Item<K extends CollectionKey> = SiteData[K][number];

interface StoreValue {
  ready: boolean;
  data: SiteData;
  upsert: <K extends CollectionKey>(key: K, item: Item<K>, activity?: string) => void;
  remove: <K extends CollectionKey>(key: K, id: string, activity?: string) => void;
  patchHomepage: (patch: Partial<HomepageSettings>, activity?: string) => void;
  patchSettings: (patch: Partial<SiteSettings>, activity?: string) => void;
  logActivity: (text: string) => void;
  resetDemo: () => void;

  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  toasts: Toast[];
  toast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;

  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function read<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<SiteData>(DEFAULT_DATA);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const storageWarned = useRef(false);

  // Load persisted demo state after hydration (server renders defaults).
  useEffect(() => {
    const stored = read<Partial<SiteData>>(KEYS.data);
    if (stored) {
      setData({
        ...DEFAULT_DATA,
        ...stored,
        homepage: { ...DEFAULT_DATA.homepage, ...(stored.homepage ?? {}) },
        settings: { ...DEFAULT_DATA.settings, ...(stored.settings ?? {}) },
      });
    }
    setCart(read<CartItem[]>(KEYS.cart) ?? []);
    setWishlist(read<string[]>(KEYS.wishlist) ?? []);
    setIsAdmin(read<boolean>(KEYS.admin) === true);
    setReady(true);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = uid("t");
      setToasts((t) => [...t.slice(-3), { id, message, type }]);
      window.setTimeout(() => dismissToast(id), 3200);
    },
    [dismissToast],
  );

  const write = useCallback(
    (key: string, value: unknown) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        if (!storageWarned.current) {
          storageWarned.current = true;
          toast("Browser storage is full — try smaller images or image links.", "error");
        }
      }
    },
    [toast],
  );

  useEffect(() => { if (ready) write(KEYS.data, data); }, [data, ready, write]);
  useEffect(() => { if (ready) write(KEYS.cart, cart); }, [cart, ready, write]);
  useEffect(() => { if (ready) write(KEYS.wishlist, wishlist); }, [wishlist, ready, write]);
  useEffect(() => { if (ready) write(KEYS.admin, isAdmin); }, [isAdmin, ready, write]);

  const withActivity = (d: SiteData, text?: string): SiteData => {
    if (!text) return d;
    const entry: Activity = { id: uid("a"), text, time: new Date().toISOString() };
    return { ...d, activity: [entry, ...d.activity].slice(0, 40) };
  };

  const upsert = useCallback(<K extends CollectionKey>(key: K, item: Item<K>, activity?: string) => {
    setData((d) => {
      const list = d[key] as Item<K>[];
      const exists = list.some((x) => x.id === item.id);
      const next = exists ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list];
      return withActivity({ ...d, [key]: next }, activity);
    });
  }, []);

  const remove = useCallback(<K extends CollectionKey>(key: K, id: string, activity?: string) => {
    setData((d) => {
      const list = d[key] as Item<K>[];
      const next: SiteData = { ...d, [key]: list.filter((x) => x.id !== id) };
      if (key === "products") {
        next.homepage = { ...d.homepage, featuredIds: d.homepage.featuredIds.filter((f) => f !== id) };
      }
      return withActivity(next, activity);
    });
    if (key === "products") {
      setCart((c) => c.filter((i) => i.productId !== id));
      setWishlist((w) => w.filter((x) => x !== id));
    }
  }, []);

  const patchHomepage = useCallback((patch: Partial<HomepageSettings>, activity?: string) => {
    setData((d) => withActivity({ ...d, homepage: { ...d.homepage, ...patch } }, activity));
  }, []);

  const patchSettings = useCallback((patch: Partial<SiteSettings>, activity?: string) => {
    setData((d) => withActivity({ ...d, settings: { ...d.settings, ...patch } }, activity));
  }, []);

  const logActivity = useCallback((text: string) => setData((d) => withActivity(d, text)), []);

  const resetDemo = useCallback(() => {
    setData(DEFAULT_DATA);
    setCart([]);
    setWishlist([]);
  }, []);

  const addToCart = useCallback(
    (productId: string, qty = 1) => {
      setCart((c) => addItem(c, productId, qty));
      setCartOpen(true);
    },
    [],
  );
  const setQty = useCallback((productId: string, qty: number) => setCart((c) => setItemQty(c, productId, qty)), []);
  const removeFromCart = useCallback((productId: string) => setCart((c) => c.filter((i) => i.productId !== productId)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((w) => {
        const has = w.includes(productId);
        toast(has ? "Removed from wishlist" : "Saved to your wishlist", "info");
        return has ? w.filter((x) => x !== productId) : [...w, productId];
      });
    },
    [toast],
  );

  const login = useCallback((email: string, password: string) => {
    const ok = checkAdminCredentials(email, password);
    if (ok) setIsAdmin(true);
    return ok;
  }, []);
  const logout = useCallback(() => setIsAdmin(false), []);

  const value = useMemo<StoreValue>(
    () => ({
      ready, data, upsert, remove, patchHomepage, patchSettings, logActivity, resetDemo,
      cart,
      cartCount: cartCount(cart),
      cartSubtotal: cartSubtotal(cart, data.products),
      cartOpen, setCartOpen, addToCart, setQty, removeFromCart, clearCart,
      wishlist, toggleWishlist,
      toasts, toast, dismissToast,
      isAdmin, login, logout,
    }),
    [ready, data, upsert, remove, patchHomepage, patchSettings, logActivity, resetDemo, cart, cartOpen, addToCart, setQty, removeFromCart, clearCart, wishlist, toggleWishlist, toasts, toast, dismissToast, isAdmin, login, logout],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
