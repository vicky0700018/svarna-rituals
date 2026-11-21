import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: ReactNode;
}

const widths = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl" };

export function Modal({ open, onClose, title, children, size = "md", footer }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="Close" className="absolute inset-0 bg-forest-deep/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className={cn("relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-card shadow-lift animate-pop-in sm:rounded-3xl", widths[size])}>
        {title && (
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h3 className="text-2xl text-forest">{title}</h3>
            <button onClick={onClose} aria-label="Close dialog" className="rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-forest">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {!title && (
          <button onClick={onClose} aria-label="Close dialog" className="absolute right-4 top-4 z-10 rounded-full bg-card/90 p-2 text-forest shadow-soft transition hover:bg-card">
            <X className="h-5 w-5" />
          </button>
        )}
        <div className="overflow-y-auto">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-3 border-t bg-secondary/40 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
