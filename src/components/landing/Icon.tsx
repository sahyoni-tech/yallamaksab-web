import { type ReactNode } from "react";

export type IconName =
  | "pin" | "heart" | "bookmark" | "megaphone" | "users" | "bell"
  | "download" | "telegram" | "whatsapp" | "mail" | "check" | "tag" | "bolt";

const paths: Record<IconName, ReactNode> = {
  pin: (<><path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>),
  heart: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />,
  bookmark: <path d="M6 4h12v16l-6-4-6 4z" />,
  megaphone: (<><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z" /><path d="M16 8a5 5 0 0 1 0 8" /></>),
  users: (<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 6a3 3 0 0 1 0 6" /><path d="M18 20a6 6 0 0 0-3-5" /></>),
  bell: (<><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 19a2 2 0 0 0 4 0" /></>),
  download: (<><path d="M12 3v12" /><path d="M7 11l5 5 5-5" /><path d="M5 21h14" /></>),
  telegram: <path d="M21 4L3 11l5 2 2 6 3-4 5 4z" />,
  whatsapp: (<><path d="M4 20l1.4-4A8 8 0 1 1 8.8 19.4z" /><path d="M9 10c0 3 2 5 5 5" /></>),
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>),
  check: <path d="M4 12l5 5 11-11" />,
  tag: (<><path d="M20 4h-7l-9 9 7 7 9-9z" /><circle cx="15" cy="9" r="1.4" /></>),
  bolt: <path d="M13 3L5 13h6l-1 8 8-10h-6z" />,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className ? `icon ${className}` : "icon"}
      data-icon={name}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
