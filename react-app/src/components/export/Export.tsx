import { createContext, ReactNode, useRef, Ref, useCallback } from "react"

type ExportContextType = {
  content: Ref<HTMLElement>,
  onExport: () => void
}
const ExportContext = createContext<ExportContextType>({
  content: null,
  onExport: () => { }
})
export default function Export({ children }: { children: ReactNode[] }) {
  const exportContentRef = useRef<HTMLElement>(null);

  const handleExport = useCallback(() => {

  }, [exportContentRef])

  return <ExportContext.Provider value={{ content: exportContentRef, onExport: handleExport }}>
    {children}
  </ExportContext.Provider>
}
