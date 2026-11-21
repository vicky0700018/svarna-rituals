import { useState } from "react";
import { EyeOff, Plus } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { useStore } from "@/lib/store";
import { uid } from "@/lib/format";
import { Modal } from "@/components/ui-luxe/Modal";
import { SmartImage } from "@/components/ui-luxe/SmartImage";
import { buttonClass } from "@/components/ui-luxe/button";
import { ActionButtons, ConfirmDelete, EmptyState, Field, ImageInput, PageHeader, SearchBar, Toggle, Toolbar, inputCls } from "./ui";

export function GalleryModule() {
  const { data, upsert, remove, toast } = useStore();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<{ g: GalleryItem; isNew: boolean } | null>(null);
  const [viewing, setViewing] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState<GalleryItem | null>(null);
  const [error, setError] = useState("");
  const list = data.gallery.filter((g) => `${g.title} ${g.caption}`.toLowerCase().includes(q.toLowerCase()));

  const save = () => {
    if (!editing) return;
    if (!editing.g.title.trim()) return setError("Title is required.");
    if (!editing.g.image) return setError("Please choose an image.");
    upsert("gallery", editing.isNew ? { ...editing.g, id: uid("g") } : editing.g, `${editing.isNew ? "Added" : "Updated"} gallery image “${editing.g.title}”`);
    toast(editing.isNew ? "Image added" : "Image updated");
    setEditing(null);
  };

  return (
    <>
      <PageHeader title="Gallery" text="The first six visible images appear in the homepage gallery." action={
        <button onClick={() => { setError(""); setEditing({ g: { id: "", title: "", caption: "", image: "", visible: true }, isNew: true }); }} className={buttonClass("primary", "md")}><Plus className="h-4 w-4" /> Add Image</button>
      } />
      <Toolbar><SearchBar value={q} onChange={setQ} placeholder="Search gallery…" /></Toolbar>
      {list.length === 0 ? <div className="rounded-2xl border bg-card"><EmptyState title="No images" text="Add an image to the gallery." /></div> : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((g) => (
            <div key={g.id} className="overflow-hidden rounded-2xl border bg-card shadow-soft">
              <div className="relative aspect-[4/3] bg-secondary">
                <SmartImage src={g.image} alt={g.title} className="h-full w-full object-cover" />
                {!g.visible && <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.15em] text-forest"><EyeOff className="h-3 w-3" /> Hidden</span>}
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0"><p className="truncate font-medium text-forest">{g.title}</p><p className="truncate text-xs text-muted-foreground">{g.caption}</p></div>
                <ActionButtons label={g.title} onView={() => setViewing(g)} onEdit={() => { setError(""); setEditing({ g, isNew: false }); }} onDelete={() => setDeleting(g)} />
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.isNew ? "Add image" : "Edit image"} size="md" footer={
        <>
          <button onClick={() => setEditing(null)} className={buttonClass("outline", "sm")}>Cancel</button>
          <button onClick={save} className={buttonClass("primary", "sm")}>Save</button>
        </>
      }>
        {editing && (
          <div className="space-y-5 p-6">
            <Field label="Title"><input value={editing.g.title} onChange={(e) => setEditing({ ...editing, g: { ...editing.g, title: e.target.value } })} className={inputCls} /></Field>
            <Field label="Caption"><input value={editing.g.caption} onChange={(e) => setEditing({ ...editing, g: { ...editing.g, caption: e.target.value } })} className={inputCls} /></Field>
            <ImageInput value={editing.g.image} onChange={(v) => setEditing({ ...editing, g: { ...editing.g, image: v } })} />
            <Toggle checked={editing.g.visible} onChange={(v) => setEditing({ ...editing, g: { ...editing.g, visible: v } })} label="Visible on website" />
            {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
          </div>
        )}
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.title} size="lg">
        {viewing && (
          <div className="p-6">
            <SmartImage src={viewing.image} alt={viewing.title} className="max-h-[65vh] w-full rounded-2xl object-contain" />
            <p className="mt-4 text-sm text-muted-foreground">{viewing.caption} · {viewing.visible ? "Visible" : "Hidden"}</p>
          </div>
        )}
      </Modal>

      <ConfirmDelete open={!!deleting} name={deleting?.title ?? ""} onCancel={() => setDeleting(null)} onConfirm={() => {
        if (deleting) { remove("gallery", deleting.id, `Deleted gallery image “${deleting.title}”`); toast("Image deleted"); }
        setDeleting(null);
      }} />
    </>
  );
}
