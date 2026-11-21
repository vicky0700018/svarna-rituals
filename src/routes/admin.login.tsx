import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";
import { ADMIN_CREDENTIALS } from "@/lib/mock-data";
import { Logo } from "@/components/site/Logo";
import { buttonClass } from "@/components/ui-luxe/button";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Svarna Rituals" },
      { name: "description", content: "Demo admin sign-in for Svarna Rituals." },
      { property: "og:title", content: "Admin Login — Svarna Rituals" },
      { property: "og:description", content: "Demo admin sign-in." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const { login, isAdmin, toast } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      setError("");
      toast("Signed in to the demo admin");
    } else setError("Incorrect email or password.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-gradient px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] bg-card p-8 shadow-lift sm:p-10">
        <Logo />
        <h1 className="mt-8 text-4xl text-forest">Admin Login</h1>
        {isAdmin ? (
          <p className="mt-6 rounded-2xl bg-secondary p-4 text-sm text-forest">You are signed in. The admin dashboard is not finished yet.</p>
        ) : (
          <form onSubmit={submit} noValidate className="mt-6 space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" aria-label="Email" className="h-12 w-full rounded-full border bg-card px-5 text-sm outline-none focus:border-gold" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" aria-label="Password" className="h-12 w-full rounded-full border bg-card px-5 text-sm outline-none focus:border-gold" />
            {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
            <button type="submit" className={buttonClass("primary", "lg", "w-full")}>Sign In</button>
          </form>
        )}
        <div className="mt-6 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-xs text-forest">
          <p className="font-medium uppercase tracking-[0.2em]">Demo credentials</p>
          <p className="mt-2">Email: {ADMIN_CREDENTIALS.email}</p>
          <p>Password: {ADMIN_CREDENTIALS.password}</p>
        </div>
      </div>
    </div>
  );
}
