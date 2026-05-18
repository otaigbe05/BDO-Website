import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_z2zip7c';
const TEMPLATE_ID = 'template_5e5v4xe';
const PUBLIC_KEY = 'H3AgT_Twc8HP5v1Lx';

export const sendEmail = async (formData) => {
  const templateParams = {
    form_type: formData.businessType ? 'Demo Request' : 'Contact Form',
    name: formData.name || '',
    email: formData.email || '',
    phone: formData.phone || '',
    businessType: formData.businessType || '',
    company: formData.company || '',
    industry: formData.industry || '',
    preferredTime: formData.preferredTime || '',
    message: formData.message || '',
  };

  const response = await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    templateParams,
    PUBLIC_KEY
  );

  if (response.status !== 200) {
    throw new Error('Failed to send email');
  }

  return response;
};