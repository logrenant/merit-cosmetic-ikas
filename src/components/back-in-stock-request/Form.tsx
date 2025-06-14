import { observer } from 'mobx-react-lite';
import { useTranslation } from '@ikas/storefront';
import { backInStockStore } from 'src/utils/backInStockStore';
import { useSendEmail } from 'src/utils/sendEmail';
import { useDirection } from 'src/utils/useDirection';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import type { BackInStockRequestProps } from '../__generated__/types';

const BackInStockRequestForm: React.FC<BackInStockRequestProps> = ({ formMessages, formRule, submitError, productName }) => {
    const { t } = useTranslation();
    const { direction } = useDirection();
    const { sendEmail } = useSendEmail();
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const urlProductName = router.query.productName as string | undefined;

    const [formState, setFormState] = useState({
        productName: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        message: '',
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedData = localStorage.getItem("backInStockData");
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    setFormState({
                        productName: parsed.productName || "",
                        firstName: parsed.firstName || "",
                        lastName: parsed.lastName || "",
                        email: parsed.email || "",
                        phoneNumber: parsed.phoneNumber || "",
                        message: parsed.message || "",
                    });
                } catch (error) {
                    console.error("Form localStorage yükleme hatası:", error);
                }
            }
        }
    }, []);

    // URL'den gelen ürün adını işle ve store'a kaydet
    useEffect(() => {
        if (urlProductName) {
            // URL'den gelen ürün adını formda göster
            setFormState(prev => ({
                ...prev,
                productName: urlProductName
            }));

            // Store'a kaydet
            backInStockStore.setProductName(urlProductName);
        }
    }, [urlProductName]);

    // Component yüklendiğinde prop'tan gelen productName'i store'a kaydet
    useEffect(() => {
        if (productName && !urlProductName) {
            backInStockStore.setProductName(productName);
        }
    }, [productName, urlProductName]);

    useEffect(() => {
        setFormState((fs) => ({
            ...fs,
            productName: backInStockStore.productName || productName || "",
            firstName: backInStockStore.firstName,
            lastName: backInStockStore.lastName,
            email: backInStockStore.email,
            phoneNumber: backInStockStore.phoneNumber,
            message: backInStockStore.message,
        }));
    }, [
        productName,
        backInStockStore.productName,
        backInStockStore.firstName,
        backInStockStore.lastName,
        backInStockStore.email,
        backInStockStore.phoneNumber,
        backInStockStore.message,
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

        switch (name) {
            case 'productName':
                backInStockStore.setProductName(value);
                break;
            case 'firstName':
                backInStockStore.setFirstName(value);
                break;
            case 'lastName':
                backInStockStore.setLastName(value);
                break;
            case 'email':
                backInStockStore.setEmail(value);
                break;
            case 'phoneNumber':
                backInStockStore.setPhoneNumber(value);
                break;
            case 'message':
                backInStockStore.setMessage(value);
                break;
        }

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

        // Form verilerini konsola yazdır
        console.log('Form verileri gönderiliyor:', {
            productName: formState.productName,
            firstName: formState.firstName,
            lastName: formState.lastName,
            phoneNumber: formState.phoneNumber,
            email: formState.email,
            message: formState.message
        });

        // Form elemanlarını kontrol et
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            console.log('FormData içeriği:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
        }

        setIsSubmitting(true);
        try {
            await sendEmail(formRef, 'request');
            setIsSubmitted(true);
            setGeneralError(null);
            // reset form
            setFormState({
                productName: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
                message: '',
            });
            // Store'u da temizle
            backInStockStore.clearAll();
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
                    className="w-full disabled:opacity-50 border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded-sm px-2.5"
                />
            ) :
                (
                    <input
                        type={type}
                        name={name === 'productName' ? 'productName' : name}
                        placeholder={t(label)}
                        value={formState[name]}
                        onChange={handleChange}
                        dir={direction}
                        disabled={name === 'productName'}
                        className={`w-full disabled:opacity-50 border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded-sm px-2.5`}
                        data-emailjs-field={name === 'productName' ? 'product_name' : name}
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
                {isSubmitted ? (
                    <div className="mb-6 p-4 bg-[color:var(--auth-color)] text-[color:var(--black-two)] rounded-sm">
                        <h2 className="font-normal text-lg">{formMessages.title}</h2>
                        <p className="mt-1 text-base">{formMessages.text}</p>
                    </div>
                ) : (
                    <>
                        {generalError && (
                            <div className="mb-6 p-4 bg-[color:var(--color-one)] text-white rounded-sm">
                                <h2 className="font-normal text-lg">{submitError}</h2>
                            </div>
                        )}
                        <form ref={formRef} className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <input
                                type="hidden"
                                name="productName"
                                value={formState.productName}
                            />
                            {/* Form fields */}
                            {renderField(productName || t('productName'), 'productName', 'text')}
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
                    </>
                )}
            </div>
        </section>
    );
};

export default observer(BackInStockRequestForm);
