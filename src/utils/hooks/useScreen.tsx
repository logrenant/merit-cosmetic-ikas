import { useScreenResize } from "./useScreenResize";

import { point } from "src/styles/breakpoints";
import { useCallback, useEffect, useState } from "react";

export function useScreen() {
    const [width, setWidth] = useState(0);
    const handleResize = useCallback(() => {
        setWidth(() => innerWidth());
    }, []);
    useScreenResize(handleResize);

    useEffect(() => {
        setWidth(innerWidth());
    }, []);

    const innerWidth = () => {
        if (typeof window === "undefined") return 0;
        return window.innerWidth;
    };

    return {
        width,
        isSmall: width < point.sm,
        isMobile: width < point.xl,
        isDesktop: width >= point.xl,
    };
}