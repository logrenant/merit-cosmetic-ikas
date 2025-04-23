import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation, ContactForm } from '@ikas/storefront';
import type { ContactpageProps } from "../__generated__/types";

const Form = ({ formRule, formMessages }: ContactpageProps) => {
    const { title, text } = formMessages;
    const { t } = useTranslation();

    const [isPending, setPending] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [domainError, setDomainError] = useState<string | undefined>(undefined);
    const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
    const allowedDomains = ["gmail.com", "hotmail.com", "outlook.com"];

    const [form] = useState(() =>
        new ContactForm({
            message: {
                requiredRule: formRule.requiredRule,
                emailRule: formRule.emailRule,
                minRule: formRule.minRule,
                phoneRule: formRule.phoneRule,
            },
        })
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isPending) return;

        // reset custom errors
        setDomainError(undefined);
        setPhoneError(undefined);

        // 1) ContactForm internal validation
        setPending(true);
        let response;
        try {
            response = await form.saveContactForm();
        } finally {
            setPending(false);
        }

        // 2) Custom email domain validation
        const emailParts = form.email.split('@');
        if (emailParts.length !== 2 || !allowedDomains.includes(emailParts[1].toLowerCase())) {
            setDomainError(formRule.emailRule);
            return response;
        }

        // 3) Custom phone numeric validation
        if (form.phone && !/^[0-9]+$/.test(form.phone)) {
            setPhoneError(formRule.phoneRule || formRule.minRule);
            return response;
        }

        // 4) If any errors, exit
        if (response.isFormError || domainError || phoneError) {
            return response;
        }

        // 5) On success, reset form and show banner
        if (response.isSuccess) {
            form.onFirstNameChange('');
            form.onLastNameChange('');
            form.onEmailChange('');
            form.onPhoneChange('');
            form.onMessageChange('');
            setIsSubmitted(true);
        }

        return response;
    };

    const renderField = (
        label: string,
        value: string,
        onChange: (v: string) => void,
        errorMessage?: string,
        type: 'text' | 'email' | 'tel' = 'text',
        textarea = false
    ) => (
        <div className="flex flex-col w-full">
            <label className="text-base text-[color:var(--black-one)] mb-0.5">
                {t(label)}
            </label>
            {textarea ? (
                <textarea
                    rows={7}
                    value={value}
                    onChange={e => {
                        onChange(e.target.value);
                        if (label === 'email') setDomainError(undefined);
                        if (label === 'phone') setPhoneError(undefined);
                    }}
                    placeholder={t(label)}
                    className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] text-base font-light border rounded-sm px-2.5"
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={e => {
                        onChange(e.target.value);
                        if (label === 'email') setDomainError(undefined);
                        if (label === 'phone') setPhoneError(undefined);
                    }}
                    placeholder={t(label)}
                    className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] text-base font-light border rounded-sm px-2.5"
                />
            )}
            {label === 'email' ? (
                (domainError ?? errorMessage) && (
                    <span className="text-red-500 mt-0.5 text-xs">
                        {domainError ?? errorMessage}
                    </span>
                )
            ) : label === 'phone' ? (
                (phoneError ?? errorMessage) && (
                    <span className="text-red-500 mt-0.5 text-xs">
                        {phoneError ?? errorMessage}
                    </span>
                )
            ) : (
                errorMessage && (
                    <span className="text-red-500 mt-0.5 text-xs">
                        {errorMessage}
                    </span>
                )
            )}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
            {isSubmitted && (
                <div className="mb-4 p-4 bg-[color:var(--auth-color)] text-[color:var(--black-two)] rounded-sm">
                    <h2 className="font-normal text-lg">{title}</h2>
                    <p className="mt-1 text-base">{text}</p>
                </div>
            )}

            {renderField("firstName", form.firstName, form.onFirstNameChange, form.firstNameErrorMessage)}
            {renderField("lastName", form.lastName, form.onLastNameChange, form.lastNameErrorMessage)}
            {renderField("email", form.email, form.onEmailChange, form.emailErrorMessage, 'email')}
            {renderField("phone", form.phone || '', form.onPhoneChange, form.phoneErrorMessage, 'tel')}
            {renderField("message", form.message, form.onMessageChange, form.messageErrorMessage, 'text', true)}

            <button
                type="submit"
                disabled={isPending}
                className="tracking-wide w-full bg-[color:var(--color-three)] text-sm font-medium text-white rounded-sm py-2.5 px-5 disabled:opacity-60"
            >
                {isPending ? t("loading") : t("submit")}
            </button>
        </form>
    );
};

export default observer(Form);
