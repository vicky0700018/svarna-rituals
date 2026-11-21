import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { EMAIL_RE, uid } from "@/lib/format";
import { cn } from "@/lib/utils";

export function NewsletterForm({ source = "Homepage", tone = "dark" }: { source?: string; tone?: "dark" | "light" }) {
  const { data, upsert, toast } = useStore();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value) return setError("Please enter your email address.");
    if (!EMAIL_RE.test(value)) return setError("Please enter a valid email address.");
    if (data.subscribers.some((s) => s.email === value)) return setError("This email is already subscribed.");
    upsert("subscribers", { id: uid("sub"), email: value, date: new Date().toISOString(), source }, `New newsletter subscriber: ${value}`);
    setError("");
    setEmail("");
    setDone(true);
    toast("Welcome to the Svarna Rituals circle.");
  };

  if (done) {
    return (
      <div className={cn("flex items-center gap-4 rounded-full border px-6 py-4 animate-pop-in", tone === "light" ? "border-ivory/30 text-ivory" : "border-forest/20 text-forest")}>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-forest-deep"><Check className="h-4 w-4" /></span>
        <p className="text-sm">Thank you for subscribing. Rituals and stories are on their way.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <div className={cn("flex items-center rounded-full border p-1.5 transition focus-within:border-gold", tone === "light" ? "border-ivory/30 bg-ivory/5" : "border-forest/20 bg-card")}>
        <label htmlFor={`nl-${source}`} className="sr-only">Email address</label>
        <input
          id={`nl-${source}`}
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          placeholder="Your email address"
          aria-invalid={!!error}
          className={cn("min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none", tone === "light" ? "text-ivory placeholder:text-ivory/50" : "text-forest placeholder:text-muted-foreground")}
        />
        <button type="submit" className="group/btn flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-3 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-forest-deep transition hover:brightness-105">
          Subscribe <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
      {error && <p className={cn("mt-3 pl-5 text-xs", tone === "light" ? "text-gold-soft" : "text-destructive")} role="alert">{error}</p>}
    </form>
  );
}
