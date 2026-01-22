import { ReactNode } from "react";
import { CarouselItem } from "../ui/carousel";
import { cn } from "@/lib/utils";

export default function HomeCarouselSlide({ className = "", children }: { className?: string, children: ReactNode }) {
  return (
    <CarouselItem>
      <div className={cn("rounded-3xl bg-bcgw-blue-dark text-white", className)}>
        {children}
      </div>
    </CarouselItem>
  )
}
