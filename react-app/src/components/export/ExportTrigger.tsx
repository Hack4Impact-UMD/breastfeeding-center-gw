import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useExport } from "./ExportContext";
import { Button } from "../ui/button";

interface ExportTriggerProps extends React.ComponentPropsWithoutRef<typeof Button> {
  asChild?: boolean;
}

const ExportTrigger = React.forwardRef<HTMLButtonElement, ExportTriggerProps>(
  ({ asChild, children, ...props }, ref) => {
    const { onExport } = useExport();
    const Comp = asChild ? Slot : Button;

    return (
      <Comp onClick={onExport} ref={ref} {...props}>
        {children || "Export"}
      </Comp>
    );
  }
);

export default ExportTrigger;
