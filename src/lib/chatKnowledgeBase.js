export const knowledgeBase = {
  company: {
    keywords: ["company", "about bdo", "what does bdo do", "who are you", "what is bdo analytics solutions", "bdo analytics"],
    response: "BDO Analytics Solutions is dedicated to transforming raw data into actionable insights. Our mission is to help businesses make data-driven decisions through our flagship OMIS product, expert data transformation, and comprehensive analytics consulting services."
  },
  leadership: {
    keywords: ["leadership", "leaders", "ceo", "who runs", "management team", "executives"],
    response: "Our leadership team consists of seasoned experts in data analytics and business intelligence. We share a unified vision to make enterprise-grade data insights accessible to businesses of all sizes, guiding our strategic direction and commitment to innovation."
  },
  services: {
    keywords: ["services", "what do you offer", "help with", "what can you do", "consulting", "training"],
    response: "We offer a wide range of services including Data Audit & Cleaning, Custom Dashboard Design, Automated Reporting, Goal Tracking, Real-time Business Intelligence, Data Transformation, Consulting, and Integration Services for SQL, Excel, and legacy tools. You can learn more on our /services page!"
  },
  features: {
    keywords: ["feature", "capability", "can omis do", "what does it do", "functions", "what is omis", "omis capabilities"],
    response: "OMIS is our powerful analytics platform featuring interactive dashboards, real-time analytics, automated reporting, goal tracking, custom visualizations, and multi-source data support. It seamlessly integrates your existing data to give you a clear, operational command center. Visit /omis-product for details."
  },
  pricing: {
    keywords: ["price", "cost", "pricing", "how much", "plans", "fee", "tiers"],
    response: "We offer 4 OMIS pricing tiers: Starter ($29/mo for 1 user), Professional ($79/mo for up to 5 users), Enterprise ($199/mo for unlimited users), and Custom (Contact us for bespoke pricing). Would you like to schedule a call to discuss which plan fits best?"
  },
  roi_calculation: {
    keywords: ["how is roi calculated", "what's included in the roi calculation", "how does the roi calculator work", "what assumptions does the roi use", "what's the typical roi for omis", "how long until i see roi", "how does pricing affect roi", "can you explain the roi logic", "roi", "return on investment", "payback"],
    response: "ROI is calculated by comparing your annual cost savings against the OMIS annual cost ($948 for the Professional plan). We measure three main components over a 12-month period: (1) Time savings from automation, (2) Labor cost reduction, and (3) Software cost reduction. Baseline costs are: manual reporting hours/week × 52 weeks × hourly rate × number of employees. We assume standard rates ($25-$75/hour), 2-10 hours/week of reporting, and teams of 1-50 employees. For example: A small business (3 employees, 5 hrs/wk, $35/hr) saves ~$27,300 annually (28x ROI). A medium business (10 employees, 8 hrs/wk, $50/hr) saves ~$208,000 (219x ROI). An enterprise (30 employees, 10 hrs/wk, $60/hr) saves ~$936,000 (987x ROI). Higher tiers yield better ROI due to advanced automation, with typical payback periods of 2-5 days. Try the interactive ROI Calculator on our OMIS product page to see your specific numbers!"
  },
  case_studies: {
    keywords: ["case study", "case studies", "testimonial", "testimonials", "success stor", "clients say", "results", "roi example"],
    response: "We have helped numerous businesses achieve remarkable ROI. Our client success stories showcase significant operational improvements and revenue growth across various sectors. We'd love to share specific use cases and testimonials relevant to your business during a consultation."
  },
  contact_support: {
    keywords: ["support", "help", "contact", "email", "phone", "reach you", "availability"],
    response: "We provide comprehensive, responsive support. You can reach our team at info@bdoanalyticssolutions.com or +1-416-848-5058. Whether you need technical assistance or want to speak with sales, we are here to help ensure your data journey is successful."
  },
  getting_started: {
    keywords: ["start", "begin", "sign up", "demo", "onboarding", "next step", "consultation", "free trial"],
    response: "Getting started is easy! The best next step is to schedule a demo or book a consultation with our experts. We'll discuss your specific data needs, review pricing options, and map out a tailored implementation plan for your business."
  },
  industries: {
    keywords: ["industry", "industries", "vertical", "retail", "healthcare", "finance", "manufacturing", "hospitality", "my business"],
    response: "We serve a diverse range of industries including retail, healthcare, finance, manufacturing, hospitality, and B2B services. Our industry-specific solutions and vertical expertise allow us to tailor OMIS and our analytics services to your unique operational use cases."
  },
  values_mission: {
    keywords: ["value", "mission", "vision", "different", "why choose", "core values"],
    response: "Our mission is to empower businesses with clear, actionable data. We operate on core values of data-driven innovation, unwavering customer success, and integrity. What sets BDO Analytics Solutions apart is our commitment to being a true partner in your growth, not just a software vendor."
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