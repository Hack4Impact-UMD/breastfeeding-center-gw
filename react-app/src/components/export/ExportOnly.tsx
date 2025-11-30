import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function ExportOnly({ children, className = "" }: { children: ReactNode, className?: string }) {
  return <div className={cn("hidden print:block", className)}>
    {children}
  </div>
}
