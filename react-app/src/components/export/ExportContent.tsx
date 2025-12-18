import { ReactNode } from "react";
import { useExport } from "./ExportContext";

export default function ExportContent({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { content } = useExport();
  return (
    <div className={className} ref={content}>
      {children}
    </div>
  );
}
