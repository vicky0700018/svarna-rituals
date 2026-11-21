import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CheckCircle2, MapPin } from "lucide-react";
import { useStore } from "@/lib/store";
import { EMAIL_RE, uid } from "@/lib/format";
import { PageHero } from "@/components/site/PageHero";
import { SocialLinks } from "@/components/site/Footer";
import { buttonClass } from "@/components/ui-luxe/button";

export const Route = createFileRoute("/_site/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Svarna Rituals" },
      { name: "description", content: "Get in touch with Svarna Rituals Essentials Private Limited, Mumbai." },
      { property: "og:title", content: "Contact Svarna Rituals" },
      { property: "og:description", content: "Send us a message — we'd love to hear from you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

type Form = { name: string; email: string; phone: string; subject: string; message: string };
const EMPTY: Form = { name: "", email: "", phone: "", subject: "", message: "" };

function ContactPage() {
  const { data, upsert } = useStore();
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Partial<Record<keyof Form, string>> = {};
    if (form.name.trim().length < 2) err.name = "Please enter your name.";
    if (!EMAIL_RE.test(form.email.trim())) err.email = "Please enter a valid email address.";
    if (form.phone && !/^[+\d][\d\s-]{6,}$/.test(form.phone.trim())) err.phone = "Please enter a valid phone number.";
    if (!form.subject.trim()) err.subject = "Please add a subject.";
    if (form.message.trim().length < 10) err.message = "Message should be at least 10 characters.";
    setErrors(err);
    if (Object.keys(err).length) return;
    upsert("enquiries", { id: uid("enq"), ...form, date: new Date().toISOString(), read: false, status: "new", notes: "" }, `New enquiry received from ${form.name}`);
    setForm(EMPTY);
    setSent(true);
  };

  const field = (key: keyof Form, label: string, type = "text") => (
    <label className="block">
      <span className="text-[0.66rem] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {key === "message" ? (
        <textarea rows={5} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-2 w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none focus:border-gold" />
      ) : (
        <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-2 h-12 w-full rounded-full border bg-card px-5 text-sm outline-none focus:border-gold" />
      )}
      {errors[key] && <span role="alert" className="mt-1 block text-xs text-destructive">{errors[key]}</span>}
    </label>
  );

  return (
    <>
      <PageHero eyebrow="Contact Us" title={<>We'd love to <em className="text-gold-soft">hear from you</em></>} text="Questions, collaborations or simply a hello — write to us." image="img:gallery-jasmine" imageAlt="Dropper bottle among jasmine flowers" />
      <section className="container-luxe grid gap-14 py-20 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {sent ? (
            <div className="rounded-[2rem] border bg-card p-10 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-gold" />
              <h2 className="mt-4 text-4xl text-forest">Thank you</h2>
              <p className="mt-2 text-muted-foreground">Your message has been received (demo submission).</p>
              <button onClick={() => setSent(false)} className={buttonClass("outline", "md", "mt-6")}>Send another</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
              {field("name", "Name")}
              {field("email", "Email", "email")}
              {field("phone", "Phone (optional)", "tel")}
              {field("subject", "Subject")}
              <div className="sm:col-span-2">{field("message", "Message")}</div>
              <button type="submit" className={buttonClass("primary", "lg", "sm:col-span-2")}>Send Message</button>
            </form>
          )}
        </div>
        <aside className="space-y-6 lg:col-span-2">
          <div className="rounded-[2rem] bg-forest-gradient p-8 text-ivory">
            <p className="eyebrow">Registered Office</p>
            <p className="mt-4 flex gap-3 leading-relaxed text-ivory/85"><MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" />{data.settings.registeredOffice}</p>
            <p className="mt-6 text-sm text-ivory/70">Email: {data.settings.email || "To be announced"}</p>
            <p className="text-sm text-ivory/70">Phone: {data.settings.phone || "To be announced"}</p>
            <SocialLinks className="mt-6 text-ivory/85" />
          </div>
          <p className="text-xs text-muted-foreground">{data.settings.companyName} · CIN {data.settings.cin}</p>
        </aside>
      </section>
    </>
  );
}
