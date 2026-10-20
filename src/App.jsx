import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';

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
const OmisProduct = lazy(() => import('@/pages/OmisProduct'));
const Services = lazy(() => import('@/pages/Services'));
const BookDemoPage = lazy(() => import('@/pages/BookDemoPage'));
const ROICalculator = lazy(() => import('@/pages/ROICalculator'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const AccountDeletionRequest = lazy(() => import('@/pages/AccountDeletionRequest'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const TradePage = lazy(() => import('@/pages/TradePage'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
// Client-website funnel (pick a template -> intake -> preview -> publish)
const SiteStart = lazy(() => import('@/pages/site/SiteStart'));
const SiteIntake = lazy(() => import('@/pages/site/SiteIntake'));
const SiteChanges = lazy(() => import('@/pages/site/SiteChanges'));
const SiteDesign = lazy(() => import('@/pages/site/SiteDesign'));
const SitePublish = lazy(() => import('@/pages/site/SitePublish'));
const SiteApprove = lazy(() => import('@/pages/site/SiteApprove'));
const SiteCare = lazy(() => import('@/pages/site/SiteCare'));
const SiteManage = lazy(() => import('@/pages/site/SiteManage'));

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
  // index.html ships each page's tags for crawlers (data-seo). Once a page sets its own
  // through Helmet, drop the shipped copy so later pages don't keep the first page's tags.
  React.useEffect(() => {
    const id = setTimeout(() => {
      document.querySelectorAll('[data-seo]').forEach((el) => {
        const key = ['name', 'property', 'rel'].find((k) => el.hasAttribute(k));
        if (key && document.querySelector(`[data-rh][${key}="${el.getAttribute(key)}"]`)) el.remove();
      });
    }, 400);
    return () => clearTimeout(id);
  }, [location.pathname]);
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/omis-product" element={<PageTransition><OmisProduct /></PageTransition>} />
          <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
          <Route path="/roi-calculator" element={<PageTransition><ROICalculator /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
          <Route path="/book-demo" element={<PageTransition><BookDemoPage /></PageTransition>} />
          <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
          <Route path="/terms-of-service" element={<PageTransition><TermsOfService /></PageTransition>} />
          <Route path="/account-deletion-request" element={<PageTransition><AccountDeletionRequest /></PageTransition>} />
          <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
          <Route path="/for/:trade" element={<PageTransition><TradePage /></PageTransition>} />
          <Route path="/site/start" element={<PageTransition><SiteStart /></PageTransition>} />
          <Route path="/site/intake/:token" element={<PageTransition><SiteIntake /></PageTransition>} />
          <Route path="/site/changes/:token" element={<PageTransition><SiteChanges /></PageTransition>} />
          <Route path="/site/design/:token" element={<PageTransition><SiteDesign /></PageTransition>} />
          <Route path="/site/publish/:token" element={<PageTransition><SitePublish /></PageTransition>} />
          <Route path="/site/care/:token" element={<PageTransition><SiteCare /></PageTransition>} />
          <Route path="/site/manage/:token" element={<PageTransition><SiteManage /></PageTransition>} />
          <Route path="/site/approve/:id/:token" element={<PageTransition><SiteApprove /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

function App() {
  return (
    <HelmetProvider>
      {/* Visitors who ask for less motion get the still version of every animation. */}
      <MotionConfig reducedMotion="user">
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
      </MotionConfig>
    </HelmetProvider>
  );
}

export default App;