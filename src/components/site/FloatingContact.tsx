import { useState } from "react";
import { MessageCircleHeart, Phone, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { InstagramIcon, WhatsappIcon } from "./icons";
import { channelHref, channelPlaceholderMessage, type ContactChannel } from "./contact-actions";

const ACTIONS: { channel: ContactChannel; label: string; Icon: typeof Phone | typeof WhatsappIcon }[] = [
  { channel: "whatsapp", label: "WhatsApp", Icon: WhatsappIcon },
  { channel: "phone", label: "Call", Icon: Phone },
  { channel: "instagram", label: "Instagram", Icon: InstagramIcon },
];

export function FloatingContact() {
  const { data, toast, cartOpen } = useStore();
  const [open, setOpen] = useState(false);

  const handle = (channel: ContactChannel) => {
    const href = channelHref(data.settings, channel);
    if (!href) {
      toast(channelPlaceholderMessage(channel), "info");
      return;
    }
    window.open(href, channel === "phone" ? "_self" : "_blank", "noopener");
  };

  return (
    <div className={cn("fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 transition-opacity sm:bottom-6 sm:right-6", cartOpen && "pointer-events-none opacity-0")}>
      <div className="flex flex-col items-end gap-3" aria-hidden={!open}>
        {ACTIONS.map(({ channel, label, Icon }, i) => (
          <button
            key={channel}
            onClick={() => handle(channel)}
            tabIndex={open ? 0 : -1}
            aria-label={label}
            style={{ transitionDelay: open ? `${(ACTIONS.length - i) * 60}ms` : "0ms" }}
            className={cn(
              "group flex items-center gap-3 transition-all duration-500 ease-out",
              open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
            )}
          >
            <span className="rounded-full bg-card px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-forest shadow-soft">{label}</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-forest text-ivory shadow-lift transition-transform duration-300 group-hover:scale-110 group-hover:bg-forest-deep">
              <Icon className="h-5 w-5" />
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close quick contact" : "Open quick contact"}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient text-forest-deep shadow-gold transition-transform duration-500 hover:scale-105"
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-gold/30 [animation-duration:2.6s]" />}
        <span className={cn("transition-transform duration-500", open && "rotate-90")}>
          {open ? <X className="h-6 w-6" /> : <MessageCircleHeart className="h-6 w-6" strokeWidth={1.5} />}
        </span>
      </button>
    </div>
  );
}
