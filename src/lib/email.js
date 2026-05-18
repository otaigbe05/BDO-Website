/**
 * Sends an email using FormSubmit.co AJAX API.
 * This ensures submissions go directly to info@bdoanalyticssolutions.com
 * @param {object} formData - The data from the form.
 * @returns {Promise<Response>}
 */
export const sendEmail = async (formData) => {
  // Using FormSubmit.co for direct email submission without backend code
  // The recipient is explicitly set to info@bdoanalyticssolutions.com
  const response = await fetch("https://formsubmit.co/ajax/info@bdoanalyticssolutions.com", {
    method: "POST",
    headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify({
        ...formData,
        _subject: `New Submission from ${formData.name || 'Website Visitor'}`,
        _template: "table", // Formats data in a nice table
        _captcha: "false"   // Optional: disable captcha for smoother dev experience
    })
  });
  
  if (!response.ok) {
    throw new Error("Failed to send email");
  }
  
  return response.json();
};