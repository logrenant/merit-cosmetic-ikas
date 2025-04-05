import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore, useTranslation } from '@ikas/storefront';
import useContact from './useContact';

const formTranslations = {
    en: {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phoneNumber: 'Phone Number',
        message: 'Message',
        submit: 'Submit',
        loading: 'Sending...',
        errors: {
            required: 'This field is required',
            invalidEmail: 'Please enter a valid email',
            minLength: 'Message must be at least 10 characters',
            invalidPhone: 'Please enter a valid phone number',
        },
    },
    ar: {
        firstName: 'الاسم الأول',
        lastName: 'الاسم الأخير',
        email: 'البريد الإلكتروني',
        phoneNumber: 'رقم الهاتف',
        message: 'الرسالة',
        submit: 'إرسال',
        loading: 'جاري الإرسال...',
        errors: {
            required: 'هذا الحقل مطلوب',
            invalidEmail: 'يرجى إدخال بريد إلكتروني صالح',
            minLength: 'يجب أن تكون الرسالة على الأقل 10 أحرف',
            invalidPhone: 'يرجى إدخال رقم هاتف صالح',
        },
    },
};

const Form = () => {
    const store = useStore();
    const [currentLang, setCurrentLang] = useState<'en' | 'ar'>('en');

    const {
        isPending,
        status,
        form,
        onFormSubmit,
        formAlert,
        onFormAlertClose,
    } = useContact();

    useEffect(() => {
        if (store.router?.locale) {
            setCurrentLang(store.router.locale === 'ar' ? 'ar' : 'en');
        }
    }, [store.router]);

    return (
        <>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    await onFormSubmit();
                }}
                className="flex w-full flex-col gap-3"
            >
                {/* First Name */}
                <div className="flex flex-col w-full">
                    <label className="text-base text-[color:var(--black-one)] mb-0.5">
                        {formTranslations[currentLang].firstName}
                    </label>
                    <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => form.onFirstNameChange(e.target.value)}
                        placeholder={formTranslations[currentLang].firstName}
                        className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded-sm px-2.5"
                    />
                    {status.firstname && (
                        <span className="text-red-500 mt-0.5 text-xs">
                            {form.firstNameErrorMessage}
                        </span>
                    )}
                </div>

                {/* Last Name */}
                <div className="flex flex-col w-full">
                    <label className="text-base text-[color:var(--black-one)] mb-0.5">
                        {formTranslations[currentLang].lastName}
                    </label>
                    <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => form.onLastNameChange(e.target.value)}
                        placeholder={formTranslations[currentLang].lastName}
                        className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded-sm px-2.5"
                    />
                    {status.lastname && (
                        <span className="text-red-500 mt-0.5 text-xs">
                            {form.lastNameErrorMessage}
                        </span>
                    )}
                </div>

                {/* Email */}
                <div className="flex flex-col w-full">
                    <label className="text-base text-[color:var(--black-one)] mb-0.5">
                        {formTranslations[currentLang].email}
                    </label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => form.onEmailChange(e.target.value)}
                        placeholder={formTranslations[currentLang].email}
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
                        {formTranslations[currentLang].phoneNumber}
                    </label>
                    <input
                        type="tel"
                        value={form.phone || ''}
                        onChange={(e) => form.onPhoneChange(e.target.value)}
                        placeholder={formTranslations[currentLang].phoneNumber}
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
                        {formTranslations[currentLang].message}
                    </label>
                    <textarea
                        value={form.message}
                        onChange={(e) => form.onMessageChange(e.target.value)}
                        placeholder={formTranslations[currentLang].message}
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
                    {isPending
                        ? formTranslations[currentLang].loading
                        : formTranslations[currentLang].submit}
                </button>
            </form>

            {/* form response */}
            {formAlert && (
                <div className="fixed bottom-2/6 right-12 z-50 flex items-start bg-[color:var(--input-color)] text-[color:var(--bg-color)] rounded-sm shadow-lg p-4">
                    <div className="flex flex-col">
                        <h2 className="font-normal text-lg">{formAlert.title}</h2>
                        <div className="mt-1">
                            <span className="text-base">{formAlert.text}</span>
                        </div>
                    </div>
                    <button
                        onClick={onFormAlertClose}
                        className="ml-4 text-[color:var(--bg-color)] text-2xl font-bold"
                        aria-label="Kapat"
                    >
                        &times;
                    </button>
                </div>
            )}
        </>
    );
};

export default observer(Form);
