import { createContext, Ref, useContext } from "react";

export type ExportContextType = {
  content?: Ref<HTMLDivElement>;
  onExport: () => void;
};

export const ExportContext = createContext<ExportContextType>({
  content: null,
  onExport: () => {},
});

export function useExport() {
  return useContext(ExportContext);
}
