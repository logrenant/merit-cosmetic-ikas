import React, { useState, useEffect } from "react";
import { useStore } from "@ikas/storefront";
import { toast } from "react-hot-toast";

export default function useEmailSubscription() {
	const store = useStore();
	const [canCreateEmailSubscription, setCanCreateEmailSubscription] = useState(false);
	const [pending, setPending] = useState(false);
	const [responseStatus, setResponseStatus] = useState<"success" | "error" | "">("");
	const [isModalVisible, setModalVisible] = useState(false);
	const [email, setEmail] = useState("");

	useEffect(() => {
		// styled-components className fix
		setCanCreateEmailSubscription(store.customerStore.canCreateEmailSubscription);
	}, [store.customerStore.canCreateEmailSubscription]);

	useEffect(() => {
		console.log("event.target.value", email);
	}, [email]);

    useEffect(() => {
		console.log("responseStatus", responseStatus);
		
	}, [responseStatus]);

	

	const onSubmit = async () => {
		if (!email || pending) return;

		try {
			setPending(true);
			const response = await store.customerStore.createEmailSubscription(email);

			setModalVisible(true);
			setResponseStatus(response ? "success" : "error");
		} catch {
			setResponseStatus("error");
		} finally {
			setPending(false);
		}
	};

	const onModalClose = () => {
		setModalVisible(false);
		setResponseStatus("");
	};

	const visible = canCreateEmailSubscription || isModalVisible;

	return {
		pending,
		visible,
		email,
		responseStatus,
		setEmail,
		isModalVisible,
		onSubmit,
		onModalClose,
	};
}
