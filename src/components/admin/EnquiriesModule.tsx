import { useState } from "react";
import { Mail, MailOpen } from "lucide-react";
import type { Enquiry, EnquiryStatus } from "@/lib/types";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui-luxe/Modal";
import { buttonClass } from "@/components/ui-luxe/button";
import { ActionButtons, Badge, ConfirmDelete, DetailRow, EmptyState, Field, FilterSelect, PageHeader, SearchBar, TableCard, Toolbar, inputCls, td, textareaCls, th } from "./ui";

const STATUS: Record<EnquiryStatus, { label: string; tone: "gold" | "warning" | "success" }> = {
  new: { label: "New", tone: "gold" },
  "in-progress": { label: "In Progress", tone: "warning" },
  resolved: { label: "Resolved", tone: "success" },
};

export function EnquiriesModule() {
  const { data, upsert, remove, toast } = useStore();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewing, setViewing] = useState<Enquiry | null>(null);
  const [editing, setEditing] = useState<Enquiry | null>(null);
  const [deleting, setDeleting] = useState<Enquiry | null>(null);

  const list = data.enquiries
    .filter((e) => {
      if (filter === "unread" && e.read) return false;
      if (filter !== "all" && filter !== "unread" && e.status !== filter) return false;
      return `${e.name} ${e.email} ${e.subject}`.toLowerCase().includes(q.toLowerCase());
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const open = (e: Enquiry) => {
    if (!e.read) upsert("enquiries", { ...e, read: true });
    setViewing({ ...e, read: true });
  };
  const toggleRead = (e: Enquiry) => {
    upsert("enquiries", { ...e, read: !e.read });
    toast(e.read ? "Marked as unread" : "Marked as read");
  };

  return (
    <>
      <PageHeader title="Enquiries" text={`${data.enquiries.length} total · ${data.enquiries.filter((e) => !e.read).length} unread`} />
      <Toolbar>
        <SearchBar value={q} onChange={setQ} placeholder="Search enquiries…" />
        <FilterSelect label="Filter enquiries" value={filter} onChange={setFilter} options={[{ value: "all", label: "All" }, { value: "unread", label: "Unread" }, { value: "new", label: "New" }, { value: "in-progress", label: "In Progress" }, { value: "resolved", label: "Resolved" }]} />
      </Toolbar>
      <TableCard>
        {list.length === 0 ? <EmptyState title="No enquiries" text="Messages from the contact form will appear here." /> : (
          <table className="w-full min-w-[820px]">
            <thead className="border-b bg-secondary/50"><tr>
              <th className={th}></th><th className={th}>From</th><th className={th}>Subject</th><th className={th}>Date</th><th className={th}>Status</th><th className={cn(th, "text-right")}>Actions</th>
            </tr></thead>
            <tbody className="divide-y">
              {list.map((e) => (
                <tr key={e.id} className={cn("hover:bg-secondary/30", !e.read && "bg-gold/5")}>
                  <td className={cn(td, "w-10")}>
                    <button onClick={() => toggleRead(e)} title={e.read ? "Mark as unread" : "Mark as read"} aria-label={e.read ? `Mark ${e.name} as unread` : `Mark ${e.name} as read`} className="rounded-full p-1.5 hover:bg-secondary">
                      {e.read ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-gold" />}
                    </button>
                  </td>
                  <td className={td}><p className={cn("text-forest", !e.read && "font-semibold")}>{e.name}</p><p className="text-xs text-muted-foreground">{e.email}</p></td>
                  <td className={cn(td, "max-w-xs")}><p className={cn("line-clamp-1", !e.read && "font-medium")}>{e.subject}</p></td>
                  <td className={cn(td, "whitespace-nowrap")}>{formatDate(e.date)}</td>
                  <td className={td}><Badge tone={STATUS[e.status].tone}>{STATUS[e.status].label}</Badge></td>
                  <td className={td}><ActionButtons label={`enquiry from ${e.name}`} onView={() => open(e)} onEdit={() => setEditing(e)} onDelete={() => setDeleting(e)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Enquiry" size="md" footer={viewing && (
        <>
          <button onClick={() => { toggleRead(viewing); setViewing(null); }} className={buttonClass("outline", "sm")}>Mark as unread</button>
          <button onClick={() => { setEditing(viewing); setViewing(null); }} className={buttonClass("primary", "sm")}>Update status</button>
        </>
      )}>
        {viewing && (
          <dl className="p-6">
            <DetailRow label="Name">{viewing.name}</DetailRow>
            <DetailRow label="Email">{viewing.email}</DetailRow>
            <DetailRow label="Phone">{viewing.phone || "—"}</DetailRow>
            <DetailRow label="Subject">{viewing.subject}</DetailRow>
            <DetailRow label="Received">{new Date(viewing.date).toLocaleString("en-IN")}</DetailRow>
            <DetailRow label="Status">{STATUS[viewing.status].label}</DetailRow>
            <DetailRow label="Message"><p className="whitespace-pre-wrap leading-relaxed">{viewing.message}</p></DetailRow>
            <DetailRow label="Notes">{viewing.notes || "—"}</DetailRow>
          </dl>
        )}
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit enquiry" size="md" footer={
        <>
          <button onClick={() => setEditing(null)} className={buttonClass("outline", "sm")}>Cancel</button>
          <button onClick={() => { if (editing) { upsert("enquiries", editing, `Enquiry from ${editing.name} updated to ${STATUS[editing.status].label}`); toast("Enquiry updated"); } setEditing(null); }} className={buttonClass("primary", "sm")}>Save</button>
        </>
      }>
        {editing && (
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <Field label="Name"><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} /></Field>
            <Field label="Email"><input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} className={inputCls} /></Field>
            <Field label="Status">
              <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as EnquiryStatus })} className={inputCls}>
                {(Object.keys(STATUS) as EnquiryStatus[]).map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
              </select>
            </Field>
            <Field label="Read state">
              <select value={editing.read ? "read" : "unread"} onChange={(e) => setEditing({ ...editing, read: e.target.value === "read" })} className={inputCls}>
                <option value="read">Read</option><option value="unread">Unread</option>
              </select>
            </Field>
            <Field label="Subject" className="sm:col-span-2"><input value={editing.subject} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} className={inputCls} /></Field>
            <Field label="Internal notes" className="sm:col-span-2"><textarea rows={3} value={editing.notes} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} className={textareaCls} /></Field>
          </div>
        )}
      </Modal>

      <ConfirmDelete open={!!deleting} name={deleting ? `the enquiry from ${deleting.name}` : ""} onCancel={() => setDeleting(null)} onConfirm={() => {
        if (deleting) { remove("enquiries", deleting.id, `Deleted enquiry from ${deleting.name}`); toast("Enquiry deleted"); }
        setDeleting(null);
      }} />
    </>
  );
}
