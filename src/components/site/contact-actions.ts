import type { SiteSettings } from "@/lib/types";

export type ContactChannel = "whatsapp" | "phone" | "instagram" | "facebook" | "pinterest" | "youtube" | "email";

const LABELS: Record<ContactChannel, string> = {
  whatsapp: "WhatsApp",
  phone: "Phone",
  instagram: "Instagram",
  facebook: "Facebook",
  pinterest: "Pinterest",
  youtube: "YouTube",
  email: "Email",
};

/** Returns a usable link for a configured channel, or null while it is still a placeholder. */
export function channelHref(settings: SiteSettings, channel: ContactChannel): string | null {
  const value = settings[channel].trim();
  if (!value) return null;
  if (channel === "whatsapp") {
    const digits = value.replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : null;
  }
  if (channel === "phone") return `tel:${value.replace(/\s/g, "")}`;
  if (channel === "email") return `mailto:${value}`;
  return /^https?:\/\//.test(value) ? value : `https://${value}`;
}

export function channelPlaceholderMessage(channel: ContactChannel): string {
  return `${LABELS[channel]} details will be added soon. (Configurable in Admin → Website Settings)`;
}
