import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}

export function SectionHeading({ eyebrow, title, text, align = "center", tone = "dark", className }: Props) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
      <h2 className={cn("text-4xl text-balance-luxe sm:text-5xl lg:text-[3.6rem]", tone === "dark" ? "text-forest" : "text-ivory")}>{title}</h2>
      {text && (
        <p className={cn("mt-6 text-base leading-relaxed sm:text-lg", tone === "dark" ? "text-muted-foreground" : "text-ivory/75")}>{text}</p>
      )}
    </Reveal>
  );
}
