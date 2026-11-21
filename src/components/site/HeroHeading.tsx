/** Renders the first sentence plainly and the rest in gold italic. */
export function HeroHeading({ text }: { text: string }) {
  const idx = text.indexOf(". ");
  if (idx === -1) return <>{text}</>;
  return (
    <>
      <span className="block">{text.slice(0, idx + 1)}</span>
      <span className="block italic text-gold-soft">{text.slice(idx + 2)}</span>
    </>
  );
}
