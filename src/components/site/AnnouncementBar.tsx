import { Sparkle } from "lucide-react";
import { useStore } from "@/lib/store";

export function AnnouncementBar() {
  const { data } = useStore();
  const { announcement, promoMessage, showPromo } = data.homepage;
  const items = [announcement, showPromo ? promoMessage : null].filter(Boolean) as string[];
  if (!items.length) return null;
  const row = [...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden bg-forest-deep py-2.5 text-ivory">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex gap-12" aria-hidden={dup === 1}>
            {row.map((t, i) => (
              <span key={`${dup}-${i}`} className="flex items-center gap-12 text-[0.66rem] font-normal uppercase tracking-[0.28em]">
                {t}
                <Sparkle className="h-3 w-3 text-gold" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
