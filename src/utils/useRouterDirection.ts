import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export function useRouterDirection() {
  const router = useRouter();
  const [direction, setDirection] = useState<"rtl" | "ltr">("ltr");

  useEffect(() => {
    // Path'e göre direction belirle
    const isArabic = router.asPath.startsWith("/ar") || router.pathname.startsWith("/ar");
    setDirection(isArabic ? "rtl" : "ltr");
  }, [router.asPath, router.pathname]);

  return {
    direction,
    isRTL: direction === "rtl",
    isLTR: direction === "ltr",
  };
}
