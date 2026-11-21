import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "gold" | "outline" | "ghost" | "light" | "lightOutline" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-sans font-medium uppercase tracking-[0.18em] transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-forest-deep hover:shadow-lift hover:-translate-y-0.5",
  gold: "bg-gold-gradient text-forest-deep shadow-gold hover:-translate-y-0.5 hover:brightness-105",
  outline: "border border-forest/30 text-forest hover:border-forest hover:bg-forest hover:text-ivory",
  ghost: "text-forest hover:bg-secondary",
  light: "bg-ivory text-forest hover:bg-card hover:-translate-y-0.5 hover:shadow-lift",
  lightOutline: "border border-ivory/50 text-ivory hover:bg-ivory hover:text-forest",
  danger: "bg-destructive text-destructive-foreground hover:brightness-110",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[0.65rem]",
  md: "h-11 px-6 text-[0.7rem]",
  lg: "h-14 px-9 text-[0.72rem]",
  icon: "h-10 w-10 p-0",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}
