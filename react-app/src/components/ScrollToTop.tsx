import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router";

export default function ScrollToTop({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }, [pathname])

  return <>
    {children}
  </>
}
