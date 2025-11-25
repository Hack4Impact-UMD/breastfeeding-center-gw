import { ReactNode, useRef, useCallback } from "react"
import { ExportContext } from "./ExportContext";

export function Export({ children }: { children: ReactNode }) {
  const exportContentRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(() => {
    if (exportContentRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write('<html><head><title>Print</title>');

        // Copy all link and style tags from the main document
        document.querySelectorAll('link[rel="stylesheet"], style').forEach(node => {
          printWindow.document.head.appendChild(node.cloneNode(true));
        });

        printWindow.document.write('</head><body>');
        printWindow.document.write(exportContentRef.current.innerHTML);
        printWindow.document.write('</body></html>');
        // printWindow.document.close();

        // Wait for styles to load before printing
        const printTimeout = setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          // printWindow.close();
        }, 500);

        // Clear timeout if the user closes the print dialog before the timeout
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
