import { useCallback } from 'react';
import emailjs from '@emailjs/browser';

export const useSendEmail = () => {
  const sendEmail = useCallback(async (
    formRef: React.RefObject<HTMLFormElement>,
    formType?: 'order' | 'request'
  ): Promise<void> => {
    if (!formRef.current) throw new Error('Form not found.');

    if (!formType) {
      const hasOrderNumber = formRef.current.elements.namedItem('orderNumber');
      const hasProductName = formRef.current.elements.namedItem('productName');
      
      formType = hasOrderNumber ? 'order' : hasProductName ? 'request' : 'order';
    }

    let serviceId, templateId, publicKey;

    if (formType === 'order') {
      // order contact form credentials
      serviceId  = 'service_w2ciycp';
      templateId = 'template_hbvrjya';
      publicKey  = 'ju1cmU1CbUIvSFz3S';

      // serviceId  = 'service_douaupc';
      // templateId = 'template_5qn747d';
      // publicKey  = 'Xd3L-DP51N7QKk90Q';
    } else {
      // back in stock request form credentials
      serviceId  = 'service_w2ciycp';
      templateId = 'template_hbvrjya';
      publicKey  = 'ju1cmU1CbUIvSFz3S';
      
      // serviceId  = 'service_douaupc';
      // templateId = 'template_7liamhb';
      // publicKey  = 'Xd3L-DP51N7QKk90Q';
    }

    if (!serviceId || !templateId || !publicKey) {
      throw new Error('EmailJS configuration is missing.');
    }

    try {
      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);
    } catch (error: any) {
      console.error(`Error sending ${formType} form:`, error);
      throw error;
    }
  }, []);

  return { sendEmail };
};
