import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore, useTranslation } from '@ikas/storefront';
import useContact from './useContact';

interface FormProps {
    onSuccess?: () => void;
}

const Form = ({ onSuccess }: FormProps) => {
    const store = useStore();
    const [currentLang, setCurrentLang] = useState<'en' | 'ar'>('en');
    const { t } = useTranslation();
    const {
        isPending,
        status,
        form,
        onFormSubmit,
    } = useContact();

    useEffect(() => {
        if (store.router?.locale) {
            setCurrentLang(store.router.locale === 'ar' ? 'ar' : 'en');
        }
    }, [store.router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await onFormSubmit();

        if (response?.isSuccess && !Object.values(status).some(val => val)) {
            onSuccess?.();
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="flex w-full flex-col gap-3"
            >
                {/* First Name */}
                <div className="flex flex-col w-full">
                    <label className="text-base text-[color:var(--black-one)] mb-0.5">
                        {t("firstName")}
                    </label>
                    <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => form.onFirstNameChange(e.target.value)}
                        placeholder={t("firstName")}
                        className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded-sm px-2.5"
                    />
                    {status.firstName && (
                        <span className="text-red-500 mt-0.5 text-xs">
                            {form.firstNameErrorMessage}
                        </span>
                    )}
                </div>

                {/* Last Name */}
                <div className="flex flex-col w-full">
                    <label className="text-base text-[color:var(--black-one)] mb-0.5">
                        {t("lastName")}
                    </label>
                    <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => form.onLastNameChange(e.target.value)}
                        placeholder={t("lastName")}
                        className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded-sm px-2.5"
                    />
                    {status.lastName && (
                        <span className="text-red-500 mt-0.5 text-xs">
                            {form.lastNameErrorMessage}
                        </span>
                    )}
                </div>

                {/* Email */}
                <div className="flex flex-col w-full">
                    <label className="text-base text-[color:var(--black-one)] mb-0.5">
                        {t("email")}
                    </label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => {
                            const value = e.target.value;
                            form.onEmailChange(value);
                        }}
                        placeholder={t("email")}
                        className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded-sm px-2.5"
                    />
                    {status.email && (
                        <span className="text-red-500 mt-0.5 text-xs">
                            {form.emailErrorMessage}
                        </span>
                    )}
                </div>

                {/* Phone */}
                <div className="flex flex-col w-full">
                    <label className="text-base text-[color:var(--black-one)] mb-0.5">
                        {t("phone")}
                    </label>
                    <input
                        type="tel"
                        value={form.phone || ''}
                        onChange={(e) => form.onPhoneChange(e.target.value)}
                        placeholder={t("phone")}
                        className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded-sm px-2.5"
                    />
                    {status.phone && (
                        <span className="text-red-500 mt-0.5 text-xs">
                            {form.phoneErrorMessage}
                        </span>
                    )}
                </div>

                {/* Message */}
                <div className="flex flex-col w-full">
                    <label className="text-base text-[color:var(--black-one)] mb-0.5">
                        {t("message")}
                    </label>
                    <textarea
                        value={form.message}
                        onChange={(e) => form.onMessageChange(e.target.value)}
                        placeholder={t("message")}
                        className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded-sm px-2.5"
                        rows={7}
                    />
                    {status.message && (
                        <span className="text-red-500 mt-0.5 text-xs">
                            {form.messageErrorMessage}
                        </span>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    disabled={isPending}
                    className="disabled:opacity-60 tracking-wide w-full bg-[color:var(--color-three)] text-sm font-medium text-white rounded-sm py-2.5 px-5"
                    type="submit"
                >
                    {isPending ? t("loading") : t("submit")}
                </button>
            </form>


        </>
    );
};

export default observer(Form);
