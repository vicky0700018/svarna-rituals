import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24" } as const;

export const InstagramIcon = (p: P) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>
);
export const FacebookIcon = (p: P) => (
  <svg {...base} {...p}><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8a0 0 0 0 1 0 0Z" /></svg>
);
export const PinterestIcon = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M10.5 20.5 12.5 12M10 13.5c-1-3 1-6 4-6s4 2.2 3.5 4.5-2.3 3.8-4 3-1.2-2.5-1.2-2.5" /></svg>
);
export const YoutubeIcon = (p: P) => (
  <svg {...base} {...p}><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10 9.5 5 2.5-5 2.5Z" fill="currentColor" /></svg>
);
export const WhatsappIcon = (p: P) => (
  <svg {...base} {...p}><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19Z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2-1.3 1.2Z" /></svg>
);

/** Brand mark: a gold sun-leaf motif. */
export const BrandMark = (p: P) => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.2} {...p}>
    <circle cx="20" cy="20" r="18.5" opacity="0.55" />
    <path d="M20 7c5 5 5 21 0 26-5-5-5-21 0-26Z" />
    <path d="M20 33V13" />
    <path d="M20 22c3-1.5 5-4 6-7M20 26c-3-1.5-5-4-6-7" opacity="0.8" />
  </svg>
);
