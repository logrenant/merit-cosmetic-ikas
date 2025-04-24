import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation, ContactForm } from '@ikas/storefront';
import type { ContactpageProps } from "../__generated__/types";

const Form = ({ formRule, formMessages }: ContactpageProps) => {
    const { title, text } = formMessages;
    const { t } = useTranslation();

    const [isPending, setPending] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [domainError, setDomainError] = useState<string>();
    const [phoneError, setPhoneError] = useState<string>();

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

        // Domain reset
        setDomainError(undefined);
        // Phone reset
        setPhoneError(undefined);

        // Phone-only numeric check
        if (form.phone && !/^[0-9]+$/.test(form.phone)) {
            setPhoneError(formRule.phoneRule || formRule.minRule);
            return;
        }

        setPending(true);
        try {
            const response = await form.saveContactForm();

            if (!response.isFormError && response.isSuccess) {
                form.onFirstNameChange('');
                form.onLastNameChange('');
                form.onEmailChange('');
                form.onPhoneChange('');
                form.onMessageChange('');
                setIsSubmitted(true);
            }
        } finally {
            setPending(false);
        }
    };

    const renderField = (
        label: string,
        value: string,
        onChange: (v: string) => void,
        errorMessage?: string,
        type: 'text' | 'email' | 'phone' = 'text',
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
                        if (label === 'phoneNumber') setPhoneError(undefined);
                    }}
                    placeholder={t(label)}
                    className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] text-base font-light border rounded-sm px-2.5"
                />
            ) : (
                <input
                    type={type === 'phone' ? 'tel' : type}
                    value={value}
                    onChange={e => {
                        onChange(e.target.value);
                        if (label === 'phoneNumber') setPhoneError(undefined);
                    }}
                    placeholder={t(label)}
                    className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] text-base font-light border rounded-sm p-2.5"
                />
            )}
            {label === 'email' ? (
                (domainError ?? errorMessage) && (
                    <span className="text-red-500 mt-0.5 text-xs">
                        {domainError ?? errorMessage}
                    </span>
                )
            ) : label === 'phoneNumber' ? (
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
            {renderField("phoneNumber", form.phone || '', form.onPhoneChange, form.phoneErrorMessage, 'phone')}
            {renderField("message", form.message, form.onMessageChange, form.messageErrorMessage, 'text', true)}

            <button
                type="submit"
                disabled={
                    isPending ||
                    Boolean(domainError) ||
                    Boolean(phoneError) ||
                    Boolean(form.firstNameErrorMessage) ||
                    Boolean(form.lastNameErrorMessage) ||
                    Boolean(form.emailErrorMessage) ||
                    Boolean(form.messageErrorMessage)
                }
                className="tracking-wide w-full bg-[color:var(--color-three)] text-sm font-medium text-white rounded-sm py-2.5 px-5 disabled:opacity-60"
            >
                {isPending ? t("loading") : t("submit")}
            </button>
        </form>
    );
};

export default observer(Form);
