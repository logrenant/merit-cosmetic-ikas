import { useState } from "react";
import { ContactForm, useStore } from "@ikas/storefront";

type FormItemStatus = "error" | undefined;

type UseContactStatus = {
    email: FormItemStatus;
    firstName: FormItemStatus;
    lastName: FormItemStatus;
    message: FormItemStatus;
    phone: FormItemStatus;
};

export default function useContact() {
    const [psInfo, setPsInfo] = useState(true);
    const [marketingInfo, setMarketingInfo] = useState(true);
    const allowedDomains = ["gmail.com", "hotmail.com", "outlook.com"];

    const [form] = useState(
        new ContactForm({
            message: {
                requiredRule: "This field is required",
                emailRule: "Please enter a valid email address",
                minRule: "Please enter at least 8 characters",
            },
        })
    );

    const [isPending, setPending] = useState(false);

    const onFormSubmit = async () => {
        if (isPending || !psInfo || !marketingInfo) return;

        const emailDomain = form.email.split("@")[1]?.toLowerCase();
        if (emailDomain && !allowedDomains.includes(emailDomain)) {
            form.emailErrorMessage;
            return;
        }


        try {
            setPending(true);
            const response = await form.saveContactForm();
            if (response.isFormError) return response;

            if (response.isSuccess) {
                form.onFirstNameChange("");
                form.onLastNameChange("");
                form.onEmailChange("");
                form.onPhoneChange("");
                form.onMessageChange("");
            }

            return response;
        } finally {
            setPending(false);
        }
    };

    const status: UseContactStatus = {
        email: form.emailErrorMessage ? "error" : undefined,
        firstName: form.firstNameErrorMessage ? "error" : undefined,
        lastName: form.lastNameErrorMessage ? "error" : undefined,
        message: form.messageErrorMessage ? "error" : undefined,
        phone: form.phoneErrorMessage ? "error" : undefined,
    };

    return {
        isPending,
        status,
        form,
        onFormSubmit,
        psInfo,
        setPsInfo,
        marketingInfo,
        setMarketingInfo,
    };
}