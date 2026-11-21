import type { ReactNode } from "react";
import { SmartImage } from "@/components/ui-luxe/SmartImage";

interface Props {
  eyebrow: string;
  title: ReactNode;
  text?: ReactNode;
  image: string;
  imageAlt: string;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, text, image, imageAlt, children }: Props) {
  return (
    <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-forest-deep text-ivory">
      <div className="absolute inset-0">
        <SmartImage src={image} alt={imageAlt} loading="eager" className="h-full w-full object-cover animate-slow-zoom" />
        <div className="absolute inset-0 bg-bottom-veil" />
        <div className="absolute inset-0 bg-hero-veil opacity-70" />
      </div>
      <div className="container-luxe relative pb-16 pt-32 sm:pb-20">
        <p className="eyebrow animate-fade-up">{eyebrow}</p>
        <h1 className="mt-5 max-w-3xl text-5xl text-balance-luxe animate-fade-up [animation-delay:120ms] sm:text-6xl lg:text-7xl">{title}</h1>
        {text && <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/80 animate-fade-up [animation-delay:240ms] sm:text-lg">{text}</p>}
        {children && <div className="mt-8 animate-fade-up [animation-delay:360ms]">{children}</div>}
      </div>
    </section>
  );
}
