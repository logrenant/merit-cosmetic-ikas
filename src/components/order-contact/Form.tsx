import { observer } from 'mobx-react-lite';
import { useTranslation } from '@ikas/storefront';
import { orderStore } from 'src/utils/orderStore';
import { useSendEmail } from 'src/utils/sendEmail';
import { useDirection } from 'src/utils/useDirection';
import React, { useEffect, useRef, useState } from 'react';
import type { OrderContactProps } from '../__generated__/types';

const OrderForm: React.FC<OrderContactProps> = ({ formMessages, formRule, submitError, orderNumberInput }) => {
    const { t } = useTranslation();
    const { direction } = useDirection();
    const { sendEmail } = useSendEmail();
    const formRef = useRef<HTMLFormElement>(null);

    const [formState, setFormState] = useState({
        orderNumber: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        message: '',
    });

    useEffect(() => {
        setFormState((fs) => ({
            ...fs,
            orderNumber: orderStore.orderNumber || "",
            firstName: orderStore.firstName,
            lastName: orderStore.lastName,
            email: orderStore.email,
            phoneNumber: orderStore.phoneNumber,
        }));
    }, [
        orderStore.orderNumber,
        orderStore.firstName,
        orderStore.lastName,
        orderStore.email,
        orderStore.phoneNumber,
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);

    const [errors, setErrors] = useState<Partial<Record<keyof typeof formState, string>>>({});

    const resetFieldError = (field: keyof typeof formState) => {
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
        resetFieldError(name as keyof typeof formState);
        setGeneralError(null);
    };

    const validate = () => {
        const e: Partial<Record<keyof typeof formState, string>> = {};
        // required checks
        (Object.keys(formState) as Array<keyof typeof formState>).forEach((field) => {
            if (!formState[field]) {
                e[field] = formRule.requiredRule;
            }
        });
        // email format
        if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
            e.email = formRule.emailRule;
        }
        // phone numeric
        if (formState.phoneNumber) {
            const phonePattern = /^\+?\d{0,13}$/;
            const isValidPhone = phonePattern.test(
                formState.phoneNumber.replace(/\s+/g, '')
            );

            if (!isValidPhone) {
                e.phoneNumber = formRule.phoneRule;
            }
        }
        // message min length
        if (formState.message && formState.message.length < 5) {
            e.message = formRule.minRule;
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setGeneralError(null);

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await sendEmail(formRef);
            setIsSubmitted(true);
            setGeneralError(null);
            // reset form
            setFormState({
                orderNumber: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
                message: '',
            });
        } catch (err) {
            console.error('Mail gönderim hatası:', err);
            setGeneralError(submitError || t('submitError') || 'Gönderim sırasında bir hata oluştu.');
            setIsSubmitted(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderField = (
        label: string,
        name: keyof typeof formState,
        type: 'text' | 'email' | 'tel' | 'textarea' = 'text',
    ) => (
        <div className="flex flex-col">
            <span className="text-base text-[color:var(--black-one)] mb-0.5">
                {t(label)}
            </span>
            {type === 'textarea' ? (
                <textarea
                    name={name}
                    placeholder={t(label)}
                    value={formState[name]}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border-[color:var(--input-color)] bg-[color:var(--tx-bg)] rounded-sm px-2.5 py-2"
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    placeholder={t(label)}
                    value={formState[name]}
                    onChange={handleChange}
                    dir={direction}
                    className={`w-full border-[color:var(--input-color)] bg-[color:var(--tx-bg)] rounded-sm px-2.5 py-2`}
                />
            )}
            {errors[name] && (
                <span className="text-red-500 text-xs mt-0.5">{errors[name]}</span>
            )}
        </div>
    );

    return (
        <section id="contact" dir={direction}>
            <div className="w-full">
                {/* Form Responses */}
                {isSubmitted && (
                    <div className="mb-6 p-4 bg-[color:var(--auth-color)] text-[color:var(--black-two)] rounded-sm">
                        <h2 className="font-normal text-lg">{formMessages.title}</h2>
                        <p className="mt-1 text-base">{formMessages.text}</p>
                    </div>
                )}
                {generalError && (
                    <div className="mb-6 p-4 bg-[color:var(--color-one)] text-white rounded-sm">
                        <h2 className="font-normal text-lg">{submitError}</h2>
                    </div>
                )}

                <form ref={formRef} className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {/* Form fields */}
                    {renderField(orderNumberInput || t('orderNumber'), 'orderNumber', 'text')}
                    {renderField(t('firstName'), 'firstName')}
                    {renderField(t('lastName'), 'lastName')}
                    {renderField(t('phoneNumber'), 'phoneNumber', 'tel')}
                    {renderField(t('email'), 'email', 'email')}
                    {renderField(t('message'), 'message', 'textarea')}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[color:var(--color-three)] text-white rounded-sm py-2.5 px-5 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? t('loading') : t('submit')}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default observer(OrderForm);
