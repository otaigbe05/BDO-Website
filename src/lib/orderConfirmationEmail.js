import { businessTemplates } from '@/config/businessTemplates';
import { STRIPE_CONFIG } from '@/config/stripeConfig';
import { sendEmail } from '@/lib/email';

export const generateOrderConfirmationHTML = (orderId, customerEmail) => {
  const linksHtml = businessTemplates.map(t => 
    `<li><strong>${t.title}</strong>: <a href="${t.downloadLink}">Download Here</a></li>`
  ).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
      <h1 style="color: #0066FF;">Order Confirmation</h1>
      <p>Thank you for your purchase! Your order (<strong>${orderId}</strong>) is confirmed.</p>
      <p>Amount Paid: $${STRIPE_CONFIG.PRICE_USD}</p>
      <hr />
      <h2>Your Downloads:</h2>
      <ul>
        ${linksHtml}
      </ul>
      <p>If you have any questions, please reply to this email.</p>
    </div>
  `;
};

export const sendOrderConfirmation = async (orderId, customerEmail) => {
  const htmlContent = generateOrderConfirmationHTML(orderId, customerEmail);
  return sendEmail({
    subject: `Order Confirmation - ${orderId}`,
    email: customerEmail,
    message: "Your templates are ready for download.",
    html: htmlContent
  });
};