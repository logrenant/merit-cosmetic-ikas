import { useCallback } from 'react';
import emailjs from '@emailjs/browser';

export const useSendEmail = () => {
  const sendEmail = useCallback(async (
    formRef: React.RefObject<HTMLFormElement>
  ): Promise<void> => {
    if (!formRef.current) throw new Error('Form not found.');

    const serviceId  = 'service_w2ciycp';
    const templateId = 'template_hbvrjya';
    const publicKey  = 'ju1cmU1CbUIvSFz3S';

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
