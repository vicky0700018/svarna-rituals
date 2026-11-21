import { useState } from "react";
import { Plus } from "lucide-react";
import type { Category } from "@/lib/types";
import { useStore } from "@/lib/store";
import { slugify } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui-luxe/Modal";
import { buttonClass } from "@/components/ui-luxe/button";
import { ActionButtons, ConfirmDelete, DetailRow, EmptyState, Field, PageHeader, SearchBar, TableCard, Toolbar, inputCls, td, textareaCls, th } from "./ui";

/** Shared CRUD for product categories and journal categories. */
export function CategoriesModule({ kind }: { kind: "categories" | "journalCategories" }) {
  const { data, upsert, remove, toast } = useStore();
  const list = data[kind];
  const isJournal = kind === "journalCategories";
  const usage = (id: string) => (isJournal ? data.articles.filter((a) => a.categoryId === id).length : data.products.filter((p) => p.categoryId === id).length);
  const unit = isJournal ? "articles" : "products";

  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<{ c: Category; isNew: boolean } | null>(null);
  const [viewing, setViewing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = list.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  const save = () => {
    if (!editing) return;
    const name = editing.c.name.trim();
    const e: Record<string, string> = {};
    if (name.length < 2) e["name"] = "Name is required.";
    const id = editing.isNew ? slugify(name) : editing.c.id;
    if (editing.isNew && list.some((c) => c.id === id)) e["name"] = "This category already exists.";
    setErrors(e);
    if (Object.keys(e).length) return;
    upsert(kind, { ...editing.c, id, name }, `${editing.isNew ? "Added" : "Updated"} ${isJournal ? "journal " : ""}category “${name}”`);
    toast(editing.isNew ? "Category added" : "Category updated");
    setEditing(null);
  };

  return (
    <>
      <PageHeader
        title={isJournal ? "Journal Categories" : "Categories"}
        text={`${list.length} categories`}
        action={<button onClick={() => { setErrors({}); setEditing({ c: { id: "", name: "", description: "" }, isNew: true }); }} className={buttonClass("primary", "md")}><Plus className="h-4 w-4" /> Add Category</button>}
      />
      <Toolbar><SearchBar value={q} onChange={setQ} placeholder="Search categories…" /></Toolbar>
      <TableCard>
        {filtered.length === 0 ? <EmptyState title="No categories" text="Add your first category." /> : (
          <table className="w-full min-w-[620px]">
            <thead className="border-b bg-secondary/50"><tr>
              <th className={th}>Name</th><th className={th}>Description</th><th className={th}>{isJournal ? "Articles" : "Products"}</th><th className={cn(th, "text-right")}>Actions</th>
            </tr></thead>
            <tbody className="divide-y">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/30">
                  <td className={cn(td, "font-medium text-forest")}>{c.name}</td>
                  <td className={cn(td, "max-w-sm text-muted-foreground")}>{c.description || "—"}</td>
                  <td className={td}>{usage(c.id)}</td>
                  <td className={td}><ActionButtons label={c.name} onView={() => setViewing(c)} onEdit={() => { setErrors({}); setEditing({ c, isNew: false }); }} onDelete={() => setDeleting(c)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.isNew ? "Add category" : "Edit category"} size="md" footer={
        <>
          <button onClick={() => setEditing(null)} className={buttonClass("outline", "sm")}>Cancel</button>
          <button onClick={save} className={buttonClass("primary", "sm")}>Save</button>
        </>
      }>
        {editing && (
          <div className="space-y-5 p-6">
            <Field label="Name" error={errors["name"]}><input value={editing.c.name} onChange={(e) => setEditing({ ...editing, c: { ...editing.c, name: e.target.value } })} className={inputCls} /></Field>
            <Field label="Description"><textarea rows={3} value={editing.c.description} onChange={(e) => setEditing({ ...editing, c: { ...editing.c, description: e.target.value } })} className={textareaCls} /></Field>
          </div>
        )}
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Category details" size="md">
        {viewing && (
          <dl className="p-6">
            <DetailRow label="Name">{viewing.name}</DetailRow>
            <DetailRow label="ID">{viewing.id}</DetailRow>
            <DetailRow label="Description">{viewing.description || "—"}</DetailRow>
            <DetailRow label="Usage">{usage(viewing.id)} {unit}</DetailRow>
          </dl>
        )}
      </Modal>

      <ConfirmDelete open={!!deleting} name={deleting ? `${deleting.name}${usage(deleting.id) ? ` (used by ${usage(deleting.id)} ${unit})` : ""}` : ""} onCancel={() => setDeleting(null)} onConfirm={() => {
        if (deleting) { remove(kind, deleting.id, `Deleted category “${deleting.name}”`); toast("Category deleted"); }
        setDeleting(null);
      }} />
    </>
  );
}
