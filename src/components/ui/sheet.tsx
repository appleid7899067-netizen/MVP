import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onOpenChange,
  side = "left",
  children,
  title,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  side?: "left" | "right";
  children: ReactNode;
  title: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/70 data-[state=open]:animate-[fadein_150ms_ease-out]" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed top-0 z-50 flex h-full w-80 max-w-xs flex-col bg-sidebar shadow-[var(--shadow-border)] outline-none",
            "data-[state=open]:animate-[panelin_250ms_var(--ease-out)]",
            side === "left" ? "left-0" : "right-0",
          )}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
