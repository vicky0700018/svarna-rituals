import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_site/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Svarna Rituals" },
      { name: "description", content: "Terms & Conditions for the Svarna Rituals website." },
      { property: "og:title", content: "Terms & Conditions — Svarna Rituals" },
      { property: "og:description", content: "Terms & Conditions for the Svarna Rituals website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <section className="container-luxe max-w-3xl py-24">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-4 text-5xl text-forest">Terms & Conditions</h1>
      <p className="mt-8 leading-relaxed text-muted-foreground">
        This page is a placeholder. The final Terms & Conditions for Svarna Rituals Essentials Private Limited will be published here once approved.
      </p>
    </section>
  ),
});
