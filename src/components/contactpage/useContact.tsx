import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ContactForm, useStore, useTranslation } from "@ikas/storefront";

export type FormAlertType = {
    status: "success" | "error";
    title: string;
    text: string;
} | null;

type FormItemStatus = "error" | undefined;

type UseContactStatus = {
    email: FormItemStatus;
    firstname: FormItemStatus;
    lastname: FormItemStatus;
    message: FormItemStatus;
    phone: FormItemStatus;
};

const formAlertMessages = {
    en: {
        success: {
            title: "Success!",
            text: "Your message has been sent successfully.",
        },
        unsuccess: {
            title: "Submission Failed",
            text: "Please check your entries and try again.",
        },
        error: {
            title: "Error!",
            text: "An error occurred while sending your message.",
        },
    },
    ar: {
        success: {
            title: "تم الإرسال بنجاح!",
            text: "لقد تم إرسال رسالتك بنجاح.",
        },
        unsuccess: {
            title: "فشل الإرسال",
            text: "يرجى مراجعة المدخلات والمحاولة مرة أخرى.",
        },
        error: {
            title: "خطأ!",
            text: "حدث خطأ أثناء إرسال رسالتك.",
        },
    },
};

export default function useContact() {
    const store = useStore();
    const [psInfo, setPsInfo] = useState(true);
    const [marketingInfo, setMarketingInfo] = useState(true);
    const router = useRouter();
    const { t } = useTranslation();
    const { locale } = router;
    const currentLang = locale === 'ar' ? 'ar' : 'en';

    const [form] = useState(
        new ContactForm({
            message: {
                requiredRule: t("required"),
                emailRule: t("required"),
                minRule: t("required"),
            },
        })
    );

    const [isPending, setPending] = useState(false);
    const [formAlert, setFormAlert] = useState<FormAlertType>(null);

    const onFormSubmit = async () => {
        if (isPending || !psInfo || !marketingInfo) return;

        try {
            setPending(true);
            setFormAlert(null);

            const response = await form.saveContactForm();
            if (response.isFormError) return;

            if (!response.isSuccess) {
                setFormAlert({
                    status: "error",
                    title: formAlertMessages[currentLang].unsuccess.title,
                    text: formAlertMessages[currentLang].unsuccess.text
                });
                return;
            }

            setFormAlert({
                status: "success",
                title: formAlertMessages[currentLang].success.title,
                text: formAlertMessages[currentLang].success.text
            });

            form.onFirstNameChange("");
            form.onLastNameChange("");
            form.onEmailChange("");
            form.onPhoneChange("");
            form.onMessageChange("");

        } catch {
            setFormAlert({
                status: "error",
                title: formAlertMessages[currentLang].error.title,
                text: formAlertMessages[currentLang].error.text
            });
        } finally {
            setPending(false);
        }
    };


    const onFormAlertClose = () => setFormAlert(null);

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
