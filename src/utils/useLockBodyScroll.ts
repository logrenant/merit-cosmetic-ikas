import { useEffect, useRef } from "react";

/**
 * useLockBodyScroll
 * Body scroll'un devre dışı bırakılması ve eski scroll pozisyonuna dönülmesi için reusable hook.
 * @param active Scroll kilidi aktif mi?
 */
export function useLockBodyScroll(active: boolean) {
  const scrollY = useRef<number>(0);

  useEffect(() => {
    if (active) {
      scrollY.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    } else {
      const y = scrollY.current;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, y);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
    };
  }, [active]);
}
