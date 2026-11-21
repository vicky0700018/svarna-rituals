import { useMemo, useState } from "react";
import { Plus, Star } from "lucide-react";
import type { Availability, Product } from "@/lib/types";
import { useStore } from "@/lib/store";
import { formatDate, formatINR, slugify } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui-luxe/Modal";
import { SmartImage } from "@/components/ui-luxe/SmartImage";
import { buttonClass } from "@/components/ui-luxe/button";
import { AVAILABILITY } from "@/components/site/availability";
import { ActionButtons, Badge, ConfirmDelete, DetailRow, EmptyState, Field, FilterSelect, ImageInput, PageHeader, SearchBar, TableCard, Toggle, Toolbar, inputCls, td, textareaCls, th } from "./ui";

const AVAIL_TONE: Record<Availability, "success" | "warning" | "danger" | "neutral"> = {
  "in-stock": "success", "low-stock": "warning", "out-of-stock": "danger", "coming-soon": "neutral",
};

function blank(categoryId: string): Product {
  return { id: "", name: "", categoryId, price: 0, size: "", short: "", description: "", image: "", gallery: [], featured: false, availability: "in-stock", published: true, createdAt: new Date().toISOString().slice(0, 10) };
}

export function ProductsModule() {
  const { data, upsert, remove, toast } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<{ product: Product; isNew: boolean } | null>(null);
  const [viewing, setViewing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const catName = (id: string) => data.categories.find((c) => c.id === id)?.name ?? "—";
  const list = useMemo(() => data.products.filter((p) => {
    if (cat !== "all" && p.categoryId !== cat) return false;
    if (status === "published" && !p.published) return false;
    if (status === "draft" && p.published) return false;
    if (status === "featured" && !p.featured) return false;
    return !q || p.name.toLowerCase().includes(q.toLowerCase());
  }), [data.products, q, cat, status]);

  const toggleFeatured = (p: Product) => {
    upsert("products", { ...p, featured: !p.featured }, `${p.name} ${p.featured ? "removed from" : "marked as"} featured`);
    toast(p.featured ? "Removed from featured" : "Marked as featured");
  };

  return (
    <>
      <PageHeader title="Products" text={`${data.products.length} products · illustrative demo catalogue`} action={
        <button onClick={() => setEditing({ product: blank(data.categories[0]?.id ?? ""), isNew: true })} className={buttonClass("primary", "md")}><Plus className="h-4 w-4" /> Add Product</button>
      } />
      <Toolbar>
        <SearchBar value={q} onChange={setQ} placeholder="Search products…" />
        <FilterSelect label="Filter by category" value={cat} onChange={setCat} options={[{ value: "all", label: "All categories" }, ...data.categories.map((c) => ({ value: c.id, label: c.name }))]} />
        <FilterSelect label="Filter by status" value={status} onChange={setStatus} options={[{ value: "all", label: "All statuses" }, { value: "published", label: "Published" }, { value: "draft", label: "Draft" }, { value: "featured", label: "Featured" }]} />
      </Toolbar>
      <TableCard>
        {list.length === 0 ? <EmptyState title="No products found" text="Try a different search or add a new product." /> : (
          <table className="w-full min-w-[820px]">
            <thead className="border-b bg-secondary/50"><tr>
              <th className={th}>Product</th><th className={th}>Category</th><th className={th}>Price</th><th className={th}>Availability</th><th className={th}>Status</th><th className={th}>Featured</th><th className={cn(th, "text-right")}>Actions</th>
            </tr></thead>
            <tbody className="divide-y">
              {list.map((p) => (
                <tr key={p.id} className="transition hover:bg-secondary/30">
                  <td className={td}>
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-secondary"><SmartImage src={p.image} alt={p.name} className="h-full w-full object-cover" /></div>
                      <div><p className="font-medium text-forest">{p.name}</p><p className="text-xs text-muted-foreground">{p.size}</p></div>
                    </div>
                  </td>
                  <td className={td}>{catName(p.categoryId)}</td>
                  <td className={cn(td, "font-medium text-forest")}>{formatINR(p.price)}</td>
                  <td className={td}><Badge tone={AVAIL_TONE[p.availability]}>{AVAILABILITY[p.availability].label}</Badge></td>
                  <td className={td}><Badge tone={p.published ? "success" : "neutral"}>{p.published ? "Published" : "Draft"}</Badge></td>
                  <td className={td}>
                    <button onClick={() => toggleFeatured(p)} aria-label={`Toggle featured for ${p.name}`} className="rounded-full p-1.5 hover:bg-secondary">
                      <Star className={cn("h-5 w-5", p.featured ? "fill-gold text-gold" : "text-muted-foreground")} />
                    </button>
                  </td>
                  <td className={td}><ActionButtons label={p.name} onView={() => setViewing(p)} onEdit={() => setEditing({ product: p, isNew: false })} onDelete={() => setDeleting(p)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      {editing && (
        <ProductForm
          initial={editing.product}
          isNew={editing.isNew}
          onClose={() => setEditing(null)}
          onSave={(p) => {
            upsert("products", p, `${editing.isNew ? "Added" : "Updated"} product “${p.name}”`);
            toast(editing.isNew ? "Product added" : "Product updated");
            setEditing(null);
          }}
        />
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Product details" size="lg">
        {viewing && (
          <div className="grid gap-6 p-6 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-secondary"><SmartImage src={viewing.image} alt={viewing.name} className="h-full w-full object-cover" /></div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {viewing.gallery.map((g, i) => <div key={i} className="aspect-square overflow-hidden rounded-lg bg-secondary"><SmartImage src={g} alt="" className="h-full w-full object-cover" /></div>)}
              </div>
            </div>
            <dl className="md:col-span-3">
              <DetailRow label="Name">{viewing.name}</DetailRow>
              <DetailRow label="URL">/product/{viewing.id}</DetailRow>
              <DetailRow label="Category">{catName(viewing.categoryId)}</DetailRow>
              <DetailRow label="Price">{formatINR(viewing.price)}</DetailRow>
              <DetailRow label="Size">{viewing.size || "—"}</DetailRow>
              <DetailRow label="Availability">{AVAILABILITY[viewing.availability].label}</DetailRow>
              <DetailRow label="Status">{viewing.published ? "Published" : "Draft"}{viewing.featured ? " · Featured" : ""}</DetailRow>
              <DetailRow label="Created">{formatDate(viewing.createdAt)}</DetailRow>
              <DetailRow label="Short">{viewing.short}</DetailRow>
              <DetailRow label="Description">{viewing.description}</DetailRow>
            </dl>
          </div>
        )}
      </Modal>

      <ConfirmDelete open={!!deleting} name={deleting?.name ?? ""} onCancel={() => setDeleting(null)} onConfirm={() => {
        if (deleting) { remove("products", deleting.id, `Deleted product “${deleting.name}”`); toast("Product deleted"); }
        setDeleting(null);
      }} />
    </>
  );
}

function ProductForm({ initial, isNew, onClose, onSave }: { initial: Product; isNew: boolean; onClose: () => void; onSave: (p: Product) => void }) {
  const { data } = useStore();
  const [p, setP] = useState<Product>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));

  const save = () => {
    const e: Record<string, string> = {};
    if (p.name.trim().length < 2) e["name"] = "Name is required.";
    if (!p.categoryId) e["categoryId"] = "Choose a category.";
    if (!(p.price > 0)) e["price"] = "Price must be greater than 0.";
    if (!p.short.trim()) e["short"] = "Short description is required.";
    const id = isNew ? slugify(p.name) : p.id;
    if (isNew && data.products.some((x) => x.id === id)) e["name"] = "A product with this name already exists.";
    setErrors(e);
    if (Object.keys(e).length) return;
    const gallery = p.gallery.filter(Boolean);
    onSave({ ...p, id, name: p.name.trim(), gallery: gallery.length ? gallery : p.image ? [p.image] : [] });
  };

  const galleryAt = (i: number) => p.gallery[i] ?? "";
  const setGallery = (i: number, v: string) => {
    const g = [...p.gallery];
    while (g.length <= i) g.push("");
    g[i] = v;
    set("gallery", g);
  };

  return (
    <Modal open onClose={onClose} title={isNew ? "Add product" : "Edit product"} size="lg" footer={
      <>
        <button onClick={onClose} className={buttonClass("outline", "sm")}>Cancel</button>
        <button onClick={save} className={buttonClass("primary", "sm")}>{isNew ? "Add Product" : "Save Changes"}</button>
      </>
    }>
      <div className="grid gap-5 p-6 sm:grid-cols-2">
        <Field label="Product name" error={errors["name"]} className="sm:col-span-2"><input value={p.name} onChange={(e) => set("name", e.target.value)} className={inputCls} /></Field>
        <Field label="Category" error={errors["categoryId"]}>
          <select value={p.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={inputCls}>
            <option value="">Select…</option>
            {data.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Price (₹)" error={errors["price"]}><input type="number" min={0} value={p.price || ""} onChange={(e) => set("price", Number(e.target.value))} className={inputCls} /></Field>
        <Field label="Size"><input value={p.size} onChange={(e) => set("size", e.target.value)} placeholder="e.g. 30 ml" className={inputCls} /></Field>
        <Field label="Availability">
          <select value={p.availability} onChange={(e) => set("availability", e.target.value as Availability)} className={inputCls}>
            {(Object.keys(AVAILABILITY) as Availability[]).map((a) => <option key={a} value={a}>{AVAILABILITY[a].label}</option>)}
          </select>
        </Field>
        <Field label="Short description" error={errors["short"]} className="sm:col-span-2"><input value={p.short} onChange={(e) => set("short", e.target.value)} className={inputCls} /></Field>
        <Field label="Full description" className="sm:col-span-2"><textarea rows={4} value={p.description} onChange={(e) => set("description", e.target.value)} className={textareaCls} /></Field>
        <div className="sm:col-span-2"><ImageInput label="Main image" value={p.image} onChange={(v) => set("image", v)} /></div>
        {[0, 1, 2].map((i) => <div key={i} className="sm:col-span-2"><ImageInput label={`Gallery image ${i + 1}`} value={galleryAt(i)} onChange={(v) => setGallery(i, v)} /></div>)}
        <div className="flex flex-wrap gap-6 sm:col-span-2">
          <Toggle checked={p.published} onChange={(v) => set("published", v)} label="Published" />
          <Toggle checked={p.featured} onChange={(v) => set("featured", v)} label="Featured product" />
        </div>
      </div>
    </Modal>
  );
}
