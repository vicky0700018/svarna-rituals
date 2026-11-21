import { useRef, useState, type ReactNode } from "react";
import { Eye, ImagePlus, Inbox, Pencil, Search, Trash2, Upload, X } from "lucide-react";
import { IMAGE_LIBRARY } from "@/lib/images";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui-luxe/Modal";
import { SmartImage } from "@/components/ui-luxe/SmartImage";
import { buttonClass } from "@/components/ui-luxe/button";

export function PageHeader({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-4xl text-forest sm:text-5xl">{title}</h1>
        {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
      </div>
      {action}
    </div>
  );
}

/** Always-visible View / Edit / Delete icon buttons. */
export function ActionButtons({ onView, onEdit, onDelete, label }: { onView?: () => void; onEdit?: () => void; onDelete?: () => void; label: string }) {
  const cls = "flex h-9 w-9 items-center justify-center rounded-full border transition";
  return (
    <div className="flex items-center justify-end gap-1.5">
      {onView && (
        <button onClick={onView} title="View" aria-label={`View ${label}`} className={cn(cls, "border-sage/60 text-forest hover:bg-sage/30")}>
          <Eye className="h-4 w-4" />
        </button>
      )}
      {onEdit && (
        <button onClick={onEdit} title="Edit" aria-label={`Edit ${label}`} className={cn(cls, "border-gold/60 text-forest hover:bg-gold/20")}>
          <Pencil className="h-4 w-4" />
        </button>
      )}
      {onDelete && (
        <button onClick={onDelete} title="Delete" aria-label={`Delete ${label}`} className={cn(cls, "border-destructive/40 text-destructive hover:bg-destructive/10")}>
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function ConfirmDelete({ open, name, onCancel, onConfirm }: { open: boolean; name: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Confirm delete"
      size="sm"
      footer={
        <>
          <button onClick={onCancel} className={buttonClass("outline", "sm")}>Cancel</button>
          <button onClick={onConfirm} className={buttonClass("danger", "sm")}><Trash2 className="h-3.5 w-3.5" /> Delete</button>
        </>
      }
    >
      <div className="flex gap-4 p-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"><Trash2 className="h-5 w-5" /></span>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Are you sure you want to delete <strong className="font-medium text-forest">{name}</strong>? This action cannot be undone.
        </p>
      </div>
    </Modal>
  );
}

export function SearchBar({ value, onChange, placeholder = "Search…" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} className="h-10 w-full rounded-full border bg-card pl-10 pr-9 text-sm outline-none focus:border-gold" />
      {value && (
        <button onClick={() => onChange("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-forest"><X className="h-4 w-4" /></button>
      )}
    </div>
  );
}

export function FilterSelect({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; label: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className="h-10 rounded-full border bg-card px-4 text-sm text-forest outline-none focus:border-gold">
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">{children}</div>;
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-gold"><Inbox className="h-6 w-6" /></span>
      <h3 className="mt-4 text-2xl text-forest">{title}</h3>
      {text && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function TableCard({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export const th = "whitespace-nowrap px-4 py-3 text-left text-[0.62rem] font-medium uppercase tracking-[0.2em] text-muted-foreground";
export const td = "px-4 py-3 align-middle text-sm";

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "danger" | "gold" }) {
  const tones = {
    neutral: "bg-secondary text-forest",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-forest",
    danger: "bg-destructive/10 text-destructive",
    gold: "bg-gold/20 text-forest",
  };
  return <span className={cn("inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.14em]", tones[tone])}>{children}</span>;
}

export function Field({ label, error, children, hint, className }: { label: string; error?: string | undefined; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
      {error && <span role="alert" className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export const inputCls = "h-11 w-full rounded-xl border bg-card px-4 text-sm outline-none transition focus:border-gold";
export const textareaCls = "w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none transition focus:border-gold";

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className="inline-flex items-center gap-3">
      <span className={cn("relative h-6 w-11 rounded-full transition", checked ? "bg-forest" : "bg-border")}>
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all", checked ? "left-[1.4rem]" : "left-0.5")} />
      </span>
      <span className="text-sm text-forest">{label}</span>
    </button>
  );
}

function downscale(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode failed"));
      img.onload = () => {
        const max = 1200;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(String(reader.result));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/** Choose an image from the bundled library, paste a URL, or upload a file. */
export function ImageInput({ value, onChange, label = "Image" }: { value: string; onChange: (v: string) => void; label?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const isLibrary = value.startsWith("img:");
  const isUpload = value.startsWith("data:");

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setErr("Please choose an image file.");
    setErr("");
    setBusy(true);
    try {
      onChange(await downscale(file));
    } catch {
      setErr("Could not read that image.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="mt-1.5 flex flex-col gap-4 sm:flex-row">
        <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl border bg-secondary sm:w-28">
          {value ? <SmartImage src={value} alt="Preview" className="h-full w-full object-cover" /> : (
            <div className="flex h-full items-center justify-center text-muted-foreground"><ImagePlus className="h-6 w-6" /></div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <select value={isLibrary ? value : ""} onChange={(e) => e.target.value && onChange(e.target.value)} aria-label="Choose from library" className={inputCls}>
            <option value="">Choose from brand photo library…</option>
            {Object.entries(IMAGE_LIBRARY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <input value={isLibrary || isUpload ? "" : value} onChange={(e) => onChange(e.target.value)} placeholder={isUpload ? "Uploaded image in use" : "…or paste an image URL (https://)"} aria-label="Image URL" className={inputCls} />
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} className={buttonClass("outline", "sm")}>
              <Upload className="h-3.5 w-3.5" /> {busy ? "Processing…" : "Upload"}
            </button>
            {value && <button type="button" onClick={() => onChange("")} className="text-xs text-muted-foreground underline hover:text-destructive">Remove</button>}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ""; }} />
          </div>
          {err && <span className="text-xs text-destructive">{err}</span>}
        </div>
      </div>
    </div>
  );
}

export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 border-b py-3 last:border-0">
      <dt className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm text-forest">{children}</dd>
    </div>
  );
}
