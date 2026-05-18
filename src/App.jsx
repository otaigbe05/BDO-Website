import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/hooks/useCart';
import { AnimatePresence, motion } from 'framer-motion';

// Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import StickyCTA from '@/components/StickyCTA';
import ChatWidget from '@/components/ChatWidget';
import PageTransition from '@/components/PageTransition';

// Lazy Loaded Pages for Performance Optimization
const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const Legal = lazy(() => import('@/pages/Legal'));
const OmisProduct = lazy(() => import('@/pages/OmisProduct'));
const Services = lazy(() => import('@/pages/Services'));
const BusinessTemplates = lazy(() => import('@/pages/BusinessTemplates'));
const BookDemoPage = lazy(() => import('@/pages/BookDemoPage'));
const ROICalculator = lazy(() => import('@/pages/ROICalculator'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const AccountDeletionRequest = lazy(() => import('@/pages/AccountDeletionRequest'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const SuccessPage = lazy(() => import('@/pages/SuccessPage'));
const CheckoutSuccessPage = lazy(() => import('@/pages/CheckoutSuccessPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Advanced ScrollToTop component handling both pathnames and hash links properly
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  React.useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);
  return null;
};

// AnimatedRoutes wrapper to properly handle AnimatePresence with location
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/omis-product" element={<PageTransition><OmisProduct /></PageTransition>} />
          <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
          <Route path="/business-templates" element={<PageTransition><BusinessTemplates /></PageTransition>} />
          <Route path="/checkout-success" element={<PageTransition><CheckoutSuccessPage /></PageTransition>} />
          <Route path="/product/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />
          <Route path="/success" element={<PageTransition><SuccessPage /></PageTransition>} />
          <Route path="/roi-calculator" element={<PageTransition><ROICalculator /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
          <Route path="/book-demo" element={<PageTransition><BookDemoPage /></PageTransition>} />
          <Route path="/legal" element={<PageTransition><Legal /></PageTransition>} />
          <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
          <Route path="/terms-of-service" element={<PageTransition><TermsOfService /></PageTransition>} />
          <Route path="/account-deletion-request" element={<PageTransition><AccountDeletionRequest /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

// Replace G-XXXXXXXXXX with your Google Analytics 4 Measurement ID from Admin → Data Streams → Measurement ID
const GA_TRACKING_ID = 'G-XXXXXXXXXX';

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        {/* Global Site Tag (gtag.js) - Google Analytics 4 */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </script>
      </Helmet>
      
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Toaster />
          
          {/* Global Floating Components */}
          <StickyCTA />
          <ChatWidget />
          
          <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
            <Header />
            <main className="flex-grow">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;