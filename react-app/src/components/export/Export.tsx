import { ReactNode, useRef, useCallback } from "react"
import { ExportContext } from "./ExportContext";

export function Export({ children }: { children: ReactNode }) {
  const exportContentRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(() => {
    if (exportContentRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write('<html><head><title>Export</title>');

        // copy styling
        document.querySelectorAll('link[rel="stylesheet"], style').forEach(node => {
          printWindow.document.head.appendChild(node.cloneNode(true));
        });

        printWindow.document.write('</head><body class="flex flex-col items-center justify-center w-full h-full">');
        printWindow.document.write(exportContentRef.current.outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        // delay for styles to apply
        const printTimeout = setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }, 200);

        printWindow.onbeforeunload = () => {
          clearTimeout(printTimeout);
        }
      }
    }
  }, [exportContentRef]);

  return <ExportContext.Provider value={{ content: exportContentRef, onExport: handleExport }}>
    {children}
  </ExportContext.Provider>
}
