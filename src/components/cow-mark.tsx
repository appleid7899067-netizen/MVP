import { cn } from "@/lib/utils";

export function CowMark({ className, title = "Bossnu.Silelo" }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      role="img"
      aria-label={title}
    >
      <circle cx="32" cy="32" r="32" fill="currentColor" />
      <path
        fill="#fff"
        d="M18.5 22.5c0-4.2 3.4-7.6 7.6-7.6h11.8c4.2 0 7.6 3.4 7.6 7.6v12.2c0 4.2-3.4 7.6-7.6 7.6H32l-8.2 6.4c-.7.55-1.7.05-1.7-.85v-5.55c-2.4-1.1-4.6-3.6-4.6-7.85V22.5Z"
      />
      <circle cx="27.2" cy="27.8" r="2.35" fill="#1a1a1a" />
      <circle cx="36.8" cy="27.8" r="2.35" fill="#1a1a1a" />
      <path
        d="M27.4 34.4c1.5 2.2 3.1 3.3 4.6 3.3s3.1-1.1 4.6-3.3"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
