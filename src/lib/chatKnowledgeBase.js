export const knowledgeBase = {
  company: {
    keywords: ["company", "about bdo", "what does bdo do", "who are you", "what is bdo analytics solutions", "bdo analytics"],
    response: "BDO Analytics Solutions is a Toronto-based data and analytics consulting practice — and the builder of OMIS, our flagship booking, deposits, and client-management platform for appointment-based businesses."
  },
  leadership: {
    keywords: ["leadership", "leaders", "ceo", "who runs", "management team", "executives"],
    response: "BDO Analytics Solutions is led by founder Otaigbe Ewoigbokhan, based in Toronto. You can read more on our /about page."
  },
  services: {
    keywords: ["services", "what do you offer", "help with", "what can you do", "consulting", "training"],
    response: "We offer data and analytics consulting — Power BI dashboard development, data audit and cleanup, automated reporting, goal tracking, and integration services — plus OMIS, our booking and client-management platform for appointment-based businesses. You can learn more on our /services page!"
  },
  features: {
    keywords: ["feature", "capability", "can omis do", "what does it do", "functions", "what is omis", "omis capabilities"],
    response: "OMIS is our booking, deposits, and client-management platform for appointment-based businesses — online booking, deposits paid directly into your own Stripe account, digital waivers, SMS/email reminders, per-staff booking links, and a business dashboard. It's live today for tattoo & piercing studios, barbershops, and auto repair shops. Visit /omis-product for details."
  },
  pricing: {
    keywords: ["price", "cost", "pricing", "how much", "plans", "fee", "tiers"],
    response: "For current OMIS pricing, check omis-crm.com/pricing — that's the source of truth. Would you like to schedule a call to discuss what fits best for your business?"
  },
  case_studies: {
    keywords: ["case study", "case studies", "testimonial", "testimonials", "success stor", "clients say", "results", "roi example"],
    response: "We're an early-stage practice and don't have public case studies to share yet. We'd love to talk through what OMIS or a consulting engagement could look like for your business during a consultation."
  },
  contact_support: {
    keywords: ["support", "help", "contact", "email", "phone", "reach you", "availability"],
    response: "You can reach our team at info@bdoanalyticssolutions.com or +1 (416) 477-9893. Whether you need technical assistance or want to speak with sales, we are here to help."
  },
  getting_started: {
    keywords: ["start", "begin", "sign up", "demo", "onboarding", "next step", "consultation", "free trial"],
    response: "Getting started is easy! The best next step is to schedule a demo or book a consultation. We'll discuss your business needs and map out a tailored plan — whether that's OMIS or a consulting engagement."
  },
  industries: {
    keywords: ["industry", "industries", "vertical", "retail", "finance", "manufacturing", "hospitality", "my business"],
    response: "OMIS is live today for tattoo & piercing studios, barbershops, and auto repair shops. Our consulting services (Power BI, dashboards, reporting) serve small businesses more broadly. Tell us about your business and we'll let you know what fits."
  },
  values_mission: {
    keywords: ["value", "mission", "vision", "different", "why choose", "core values"],
    response: "Our mission is to give small business owners clarity and control — over their bookings, their client relationships, and their numbers. We operate on core values of practicality, consistency, and being a true partner, not just a software vendor."
  }
};

export const getBotResponse = (query) => {
  const lowerQuery = query.toLowerCase();
  
  // Sort entries by keyword length descending to match more specific phrases first
  const sortedEntries = Object.entries(knowledgeBase).sort((a, b) => {
    const maxLenA = Math.max(...a[1].keywords.map(k => k.length));
    const maxLenB = Math.max(...b[1].keywords.map(k => k.length));
    return maxLenB - maxLenA;
  });

  for (const [key, data] of sortedEntries) {
    if (data.keywords.some(keyword => lowerQuery.includes(keyword))) {
      return data.response;
    }
  }
  
  // Default fallback
  return "I'm not entirely sure about that specific detail, but our data experts would love to discuss it with you! Would you like to schedule a free consultation or book a demo to learn more?";
};