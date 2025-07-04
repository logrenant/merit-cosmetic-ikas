import { useState, useEffect } from "react";
import UIStore from "../store/ui-store";

export function useDirection() {
	const [direction, setDirection] = useState<"rtl" | "ltr">("ltr");
	const uiStore = UIStore.getInstance();

	useEffect(() => {
		setDirection(uiStore.direction);
	}, [uiStore.direction]);

	return {
		direction,
	};
}

