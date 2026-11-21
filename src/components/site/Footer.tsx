import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { useStore } from "@/lib/store";
import { Logo } from "./Logo";
import { FacebookIcon, InstagramIcon, PinterestIcon, YoutubeIcon } from "./icons";
import { channelHref, channelPlaceholderMessage, type ContactChannel } from "./contact-actions";

const SOCIALS: { channel: ContactChannel; label: string; Icon: typeof InstagramIcon }[] = [
  { channel: "instagram", label: "Instagram", Icon: InstagramIcon },
  { channel: "facebook", label: "Facebook", Icon: FacebookIcon },
  { channel: "pinterest", label: "Pinterest", Icon: PinterestIcon },
  { channel: "youtube", label: "YouTube", Icon: YoutubeIcon },
];

export function SocialLinks({ className = "" }: { className?: string }) {
  const { data, toast } = useStore();
  return (
    <div className={`flex gap-2 ${className}`}>
      {SOCIALS.map(({ channel, label, Icon }) => {
        const href = channelHref(data.settings, channel);
        const cls = "flex h-10 w-10 items-center justify-center rounded-full border border-current/25 transition hover:-translate-y-0.5 hover:border-gold hover:text-gold";
        return href ? (
          <a key={channel} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}>
            <Icon className="h-4 w-4" />
          </a>
        ) : (
          <button key={channel} onClick={() => toast(channelPlaceholderMessage(channel), "info")} aria-label={label} className={cls}>
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}

export function Footer() {
  const { data } = useStore();
  const s = data.settings;
  const heading = "mb-5 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-gold";
  const link = "text-sm text-ivory/70 transition hover:text-ivory hover:pl-1";

  return (
    <footer className="relative overflow-hidden bg-forest-gradient text-ivory">
      <div className="container-luxe grid gap-12 pb-12 pt-20 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/70">{s.footerAbout}</p>
          <SocialLinks className="mt-8 text-ivory/80" />
        </div>

        <div className="lg:col-span-2">
          <h4 className={heading}>Quick Links</h4>
          <ul className="space-y-3">
            <li><Link to="/" className={link}>Home</Link></li>
            <li><Link to="/about" className={link}>About Us</Link></li>
            <li><Link to="/ingredients" className={link}>Our Philosophy</Link></li>
            <li><Link to="/rituals" className={link}>Our Rituals</Link></li>
            <li><Link to="/journal" className={link}>Journal</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className={heading}>Collections</h4>
          <ul className="space-y-3">
            <li><Link to="/collections" className={link}>Shop All</Link></li>
            {data.categories.slice(0, 5).map((c) => (
              <li key={c.id}><Link to="/collections" search={{ category: c.id }} className={link}>{c.name}</Link></li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className={heading}>Customer Support</h4>
          <ul className="space-y-3">
            <li><Link to="/contact" className={link}>Contact Us</Link></li>
            <li><Link to="/privacy" className={link}>Privacy Policy</Link></li>
            <li><Link to="/terms" className={link}>Terms &amp; Conditions</Link></li>
            <li><Link to="/admin/login" className={link}>Admin Login</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className={heading}>Registered Office</h4>
          <p className="flex gap-2 text-sm leading-relaxed text-ivory/70">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            {s.registeredOffice}
          </p>
          <p className="mt-4 text-xs text-ivory/50">Email: {s.email || "To be announced"}</p>
          <p className="mt-1 text-xs text-ivory/50">Phone: {s.phone || "To be announced"}</p>
        </div>
      </div>

      <div className="container-luxe">
        <div className="gold-rule opacity-40" />
        <div className="flex flex-col gap-3 py-8 pb-24 text-xs text-ivory/55 sm:pb-8 md:flex-row md:items-center md:justify-between">
          <p>© 2026 {s.companyName}. CIN {s.cin}.</p>
          <p className="text-ivory/45">{s.footerNote}</p>
          <p>Designed and development by SOSynch Ai Tech</p>
        </div>
      </div>
    </footer>
  );
}
