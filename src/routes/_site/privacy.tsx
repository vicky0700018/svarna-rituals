import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_site/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Svarna Rituals" },
      { name: "description", content: "Privacy Policy for the Svarna Rituals website." },
      { property: "og:title", content: "Privacy Policy — Svarna Rituals" },
      { property: "og:description", content: "Privacy Policy for the Svarna Rituals website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <section className="container-luxe max-w-3xl py-24">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-4 text-5xl text-forest">Privacy Policy</h1>
      <p className="mt-8 leading-relaxed text-muted-foreground">
        This page is a placeholder. The final Privacy Policy for Svarna Rituals Essentials Private Limited will be published here once approved.
      </p>
    </section>
  ),
});
