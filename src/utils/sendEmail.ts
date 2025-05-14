import { useCallback } from 'react';
import emailjs from '@emailjs/browser';

export const useSendEmail = () => {
  const sendEmail = useCallback(async (
    formRef: React.RefObject<HTMLFormElement>
  ): Promise<void> => {
    if (!formRef.current) throw new Error('Form not found.');

    const serviceId  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      throw new Error('EmailJS configuration is missing.');
    }

    try {
      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);
    } catch (error: any) {
      throw error;
    }
  }, []);

  return { sendEmail };
};
