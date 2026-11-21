import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { resolveImage } from "@/lib/images";
import { cn } from "@/lib/utils";
import { BrandMark } from "./icons";

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const { data } = useStore();
  const { logoImage, logoText } = data.settings;
  return (
    <Link to="/" className={cn("group flex items-center gap-3", className)} aria-label={`${data.settings.brandName} home`}>
      {logoImage ? (
        <img src={resolveImage(logoImage)} alt={data.settings.brandName} className="h-10 w-auto object-contain" />
      ) : (
        <>
          <BrandMark className="h-9 w-9 text-gold transition-transform duration-700 group-hover:rotate-[20deg]" />
          <span className="flex flex-col leading-none">
            <span className={cn("font-serif text-[1.55rem] tracking-[0.28em]", tone === "dark" ? "text-forest" : "text-ivory")}>{logoText}</span>
            <span className="mt-1 text-[0.55rem] font-medium tracking-[0.62em] text-gold">RITUALS</span>
          </span>
        </>
      )}
    </Link>
  );
}
