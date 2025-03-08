import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ContactForm, useStore, useTranslation } from "@ikas/storefront";

export type FormAlertType = {
    status: "success" | "error";
    title: string;
    text: string;
};

type FormItemStatus = "error" | undefined;

type UseContactStatus = {
    email: FormItemStatus;
    firstname: FormItemStatus;
    lastname: FormItemStatus;
    message: FormItemStatus;
    phone: FormItemStatus;
};

export default function useContact() {
    const [psInfo, setPsInfo] = useState(true);
    const [marketingInfo, setMarketingInfo] = useState(true);
    const router = useRouter();
    const { t } = useTranslation();

    const [form] = useState(
        new ContactForm({
            message: {
                requiredRule: t("formMessage.requiredRule"),
                emailRule: t("formMessage.emailRule"),
                minRule: t("formMessage.minRule"),
            },
        })
    );

    const [isPending, setPending] = useState(false);
    const [formAlert, setFormAlert] = useState<FormAlertType>();

    useEffect(() => {
        const store = useStore();
        if (!store.customerStore.customer?.id) return;
        router.push(form.redirect ? decodeURIComponent(form.redirect) : "/");
    }, []);

    const onFormSubmit = async () => {
        if (isPending || !psInfo || !marketingInfo) return;

        try {
            setPending(true);
            setFormAlert(undefined);

            const response = await form.saveContactForm();
            if (response.isFormError) return;

            if (!response.isSuccess) {
                setFormAlert({
                    status: "error",
                    title: t("formAlert.unsuccessTitle"),
                    text: t("formAlert.unsuccessText")
                });
                return;
            }

            setFormAlert({
                status: "success",
                title: t("formAlert.successTitle"),
                text: t("formAlert.successText")
            });

            setTimeout(() => {
                router.push(form.redirect ? decodeURIComponent(form.redirect) : "/");
            }, 1000);

        } catch {
            setFormAlert({
                status: "error",
                title: t("formAlert.errorTitle"),
                text: t("formAlert.errorText")
            });
        } finally {
            setPending(false);
        }
    };

    const onFormAlertClose = () => setFormAlert(undefined);

    const status: UseContactStatus = {
        email: form.emailErrorMessage ? "error" : undefined,
        firstname: form.firstNameErrorMessage ? "error" : undefined,
        lastname: form.lastNameErrorMessage ? "error" : undefined,
        message: form.messageErrorMessage ? "error" : undefined,
        phone: form.phoneErrorMessage ? "error" : undefined,
    };

    return {
        isPending,
        status,
        form,
        onFormSubmit,
        formAlert,
        setFormAlert,
        onFormAlertClose,
        psInfo,
        setPsInfo,
        marketingInfo,
        setMarketingInfo,
    };
}