import { useState } from "react";
import { Download } from "lucide-react";
import type { Subscriber } from "@/lib/types";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui-luxe/Modal";
import { buttonClass } from "@/components/ui-luxe/button";
import { ActionButtons, ConfirmDelete, DetailRow, EmptyState, PageHeader, SearchBar, TableCard, Toolbar, td, th } from "./ui";

export function NewsletterModule() {
  const { data, remove, toast } = useStore();
  const [q, setQ] = useState("");
  const [viewing, setViewing] = useState<Subscriber | null>(null);
  const [deleting, setDeleting] = useState<Subscriber | null>(null);
  const list = data.subscribers.filter((s) => s.email.includes(q.toLowerCase())).sort((a, b) => b.date.localeCompare(a.date));

  const exportCsv = () => {
    const csv = ["email,date,source", ...data.subscribers.map((s) => `${s.email},${s.date},${s.source}`)].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "svarna-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast("Subscriber list downloaded");
  };

  return (
    <>
      <PageHeader title="Newsletter" text={`${data.subscribers.length} subscribers`} action={<button onClick={exportCsv} className={buttonClass("outline", "md")}><Download className="h-4 w-4" /> Export CSV</button>} />
      <Toolbar><SearchBar value={q} onChange={setQ} placeholder="Search by email…" /></Toolbar>
      <TableCard>
        {list.length === 0 ? <EmptyState title="No subscribers" text="Sign-ups from the website will appear here." /> : (
          <table className="w-full min-w-[560px]">
            <thead className="border-b bg-secondary/50"><tr><th className={th}>Email</th><th className={th}>Subscribed</th><th className={th}>Source</th><th className={cn(th, "text-right")}>Actions</th></tr></thead>
            <tbody className="divide-y">
              {list.map((s) => (
                <tr key={s.id} className="hover:bg-secondary/30">
                  <td className={cn(td, "font-medium text-forest")}>{s.email}</td>
                  <td className={cn(td, "whitespace-nowrap")}>{new Date(s.date).toLocaleDateString("en-IN")}</td>
                  <td className={td}>{s.source}</td>
                  <td className={td}><ActionButtons label={s.email} onView={() => setViewing(s)} onDelete={() => setDeleting(s)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>
      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Subscriber details" size="sm">
        {viewing && (
          <dl className="p-6">
            <DetailRow label="Email">{viewing.email}</DetailRow>
            <DetailRow label="Subscribed">{new Date(viewing.date).toLocaleString("en-IN")}</DetailRow>
            <DetailRow label="Source">{viewing.source}</DetailRow>
          </dl>
        )}
      </Modal>
      <ConfirmDelete open={!!deleting} name={deleting?.email ?? ""} onCancel={() => setDeleting(null)} onConfirm={() => {
        if (deleting) { remove("subscribers", deleting.id, `Removed subscriber ${deleting.email}`); toast("Subscriber removed"); }
        setDeleting(null);
      }} />
    </>
  );
}
