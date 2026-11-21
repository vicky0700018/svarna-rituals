import { useState, type ImgHTMLAttributes } from "react";
import { Leaf } from "lucide-react";
import { resolveImage } from "@/lib/images";
import { cn } from "@/lib/utils";

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string | undefined;
  alt: string;
  wrapperClassName?: string;
}

/** Image with a branded fallback when the source is missing or fails to load. */
export function SmartImage({ src, alt, className, wrapperClassName, loading = "lazy", ...rest }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const resolved = resolveImage(src);
  const failed = !resolved || failedSrc === resolved;

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-2 bg-secondary text-forest/50",
          className,
          wrapperClassName,
        )}
      >
        <Leaf className="h-8 w-8" strokeWidth={1} />
        <span className="eyebrow text-[0.6rem] text-forest/50">Svarna Rituals</span>
      </div>
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailedSrc(resolved)}
      className={className}
      {...rest}
    />
  );
}
