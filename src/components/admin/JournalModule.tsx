import { useState } from "react";
import { Plus } from "lucide-react";
import type { Article } from "@/lib/types";
import { useStore } from "@/lib/store";
import { formatDate, slugify } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui-luxe/Modal";
import { SmartImage } from "@/components/ui-luxe/SmartImage";
import { buttonClass } from "@/components/ui-luxe/button";
import { ActionButtons, Badge, ConfirmDelete, EmptyState, Field, FilterSelect, ImageInput, PageHeader, SearchBar, TableCard, Toggle, Toolbar, inputCls, td, textareaCls, th } from "./ui";

function blank(categoryId: string): Article {
  return { id: "", title: "", excerpt: "", content: "", categoryId, image: "", author: "Svarna Rituals Editorial", date: new Date().toISOString().slice(0, 10), readTime: 4, published: false, featured: false };
}

export function JournalModule() {
  const { data, upsert, remove, toast } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<{ a: Article; isNew: boolean } | null>(null);
  const [viewing, setViewing] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState<Article | null>(null);
  const catName = (id: string) => data.journalCategories.find((c) => c.id === id)?.name ?? "—";

  const list = data.articles
    .filter((a) => (cat === "all" || a.categoryId === cat) && (status === "all" || (status === "published" ? a.published : !a.published)) && a.title.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date));

  const togglePublish = (a: Article) => {
    upsert("articles", { ...a, published: !a.published }, `Article “${a.title}” ${a.published ? "unpublished" : "published"}`);
    toast(a.published ? "Article unpublished" : "Article published");
  };

  return (
    <>
      <PageHeader title="Journal" text={`${data.articles.length} articles · ${data.articles.filter((a) => a.published).length} published`} action={
        <button onClick={() => setEditing({ a: blank(data.journalCategories[0]?.id ?? ""), isNew: true })} className={buttonClass("primary", "md")}><Plus className="h-4 w-4" /> Add Article</button>
      } />
      <Toolbar>
        <SearchBar value={q} onChange={setQ} placeholder="Search articles…" />
        <FilterSelect label="Filter by category" value={cat} onChange={setCat} options={[{ value: "all", label: "All categories" }, ...data.journalCategories.map((c) => ({ value: c.id, label: c.name }))]} />
        <FilterSelect label="Filter by status" value={status} onChange={setStatus} options={[{ value: "all", label: "All statuses" }, { value: "published", label: "Published" }, { value: "draft", label: "Unpublished" }]} />
      </Toolbar>
      <TableCard>
        {list.length === 0 ? <EmptyState title="No articles found" text="Write your first story." /> : (
          <table className="w-full min-w-[820px]">
            <thead className="border-b bg-secondary/50"><tr>
              <th className={th}>Article</th><th className={th}>Category</th><th className={th}>Date</th><th className={th}>Status</th><th className={th}>Publish</th><th className={cn(th, "text-right")}>Actions</th>
            </tr></thead>
            <tbody className="divide-y">
              {list.map((a) => (
                <tr key={a.id} className="hover:bg-secondary/30">
                  <td className={td}>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary"><SmartImage src={a.image} alt={a.title} className="h-full w-full object-cover" /></div>
                      <div className="max-w-xs"><p className="line-clamp-1 font-medium text-forest">{a.title}</p><p className="text-xs text-muted-foreground">{a.readTime} min read{a.featured ? " · Featured" : ""}</p></div>
                    </div>
                  </td>
                  <td className={td}>{catName(a.categoryId)}</td>
                  <td className={cn(td, "whitespace-nowrap")}>{formatDate(a.date)}</td>
                  <td className={td}><Badge tone={a.published ? "success" : "neutral"}>{a.published ? "Published" : "Draft"}</Badge></td>
                  <td className={td}><Toggle checked={a.published} onChange={() => togglePublish(a)} label={a.published ? "On" : "Off"} /></td>
                  <td className={td}><ActionButtons label={a.title} onView={() => setViewing(a)} onEdit={() => setEditing({ a, isNew: false })} onDelete={() => setDeleting(a)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      {editing && <ArticleForm initial={editing.a} isNew={editing.isNew} onClose={() => setEditing(null)} onSave={(a) => {
        upsert("articles", a, `${editing.isNew ? "Added" : "Updated"} article “${a.title}”`);
        toast(editing.isNew ? "Article added" : "Article updated");
        setEditing(null);
      }} />}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Article preview" size="lg">
        {viewing && (
          <article className="p-6">
            <div className="overflow-hidden rounded-2xl"><SmartImage src={viewing.image} alt={viewing.title} className="aspect-[16/8] w-full object-cover" /></div>
            <p className="eyebrow mt-6">{catName(viewing.categoryId)} · {formatDate(viewing.date)} · {viewing.published ? "Published" : "Draft"}</p>
            <h2 className="mt-3 text-4xl text-forest">{viewing.title}</h2>
            <p className="mt-3 font-serif text-xl text-muted-foreground">{viewing.excerpt}</p>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-charcoal/85">{viewing.content.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}</div>
            <p className="mt-6 text-xs text-muted-foreground">URL: /journal/{viewing.id} · By {viewing.author}</p>
          </article>
        )}
      </Modal>

      <ConfirmDelete open={!!deleting} name={deleting?.title ?? ""} onCancel={() => setDeleting(null)} onConfirm={() => {
        if (deleting) { remove("articles", deleting.id, `Deleted article “${deleting.title}”`); toast("Article deleted"); }
        setDeleting(null);
      }} />
    </>
  );
}

function ArticleForm({ initial, isNew, onClose, onSave }: { initial: Article; isNew: boolean; onClose: () => void; onSave: (a: Article) => void }) {
  const { data } = useStore();
  const [a, setA] = useState<Article>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof Article>(k: K, v: Article[K]) => setA((x) => ({ ...x, [k]: v }));

  const save = () => {
    const e: Record<string, string> = {};
    if (a.title.trim().length < 3) e["title"] = "Title is required.";
    if (!a.excerpt.trim()) e["excerpt"] = "Excerpt is required.";
    if (a.content.trim().length < 20) e["content"] = "Content should be at least 20 characters.";
    const id = isNew ? slugify(a.title) : a.id;
    if (isNew && data.articles.some((x) => x.id === id)) e["title"] = "An article with this title already exists.";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({ ...a, id, title: a.title.trim() });
  };

  return (
    <Modal open onClose={onClose} title={isNew ? "Add article" : "Edit article"} size="lg" footer={
      <>
        <button onClick={onClose} className={buttonClass("outline", "sm")}>Cancel</button>
        <button onClick={save} className={buttonClass("primary", "sm")}>{isNew ? "Add Article" : "Save Changes"}</button>
      </>
    }>
      <div className="grid gap-5 p-6 sm:grid-cols-2">
        <Field label="Title" error={errors["title"]} className="sm:col-span-2"><input value={a.title} onChange={(e) => set("title", e.target.value)} className={inputCls} /></Field>
        <Field label="Category">
          <select value={a.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={inputCls}>
            {data.journalCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Author"><input value={a.author} onChange={(e) => set("author", e.target.value)} className={inputCls} /></Field>
        <Field label="Date"><input type="date" value={a.date.slice(0, 10)} onChange={(e) => set("date", e.target.value)} className={inputCls} /></Field>
        <Field label="Read time (minutes)"><input type="number" min={1} value={a.readTime} onChange={(e) => set("readTime", Math.max(1, Number(e.target.value)))} className={inputCls} /></Field>
        <Field label="Excerpt" error={errors["excerpt"]} className="sm:col-span-2"><input value={a.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={inputCls} /></Field>
        <Field label="Content" error={errors["content"]} hint="Separate paragraphs with a blank line." className="sm:col-span-2"><textarea rows={8} value={a.content} onChange={(e) => set("content", e.target.value)} className={textareaCls} /></Field>
        <div className="sm:col-span-2"><ImageInput label="Cover image" value={a.image} onChange={(v) => set("image", v)} /></div>
        <div className="flex flex-wrap gap-6 sm:col-span-2">
          <Toggle checked={a.published} onChange={(v) => set("published", v)} label="Published" />
          <Toggle checked={a.featured} onChange={(v) => set("featured", v)} label="Featured article" />
        </div>
      </div>
    </Modal>
  );
}
