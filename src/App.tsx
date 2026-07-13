import { useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { ReactLenis, useLenis } from "lenis/react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "./components/Navbar";
import Preloader from "./components/Preloader";
import Home from "./pages/Home";
const FAQPage = lazy(() => import("./pages/FAQPage"));
const WorkflowPage = lazy(() => import("./pages/WorkflowPage"));
import Footer from "./sections/Footer";
import { TransitionProvider, useTransition } from "./context/TransitionContext";

function Layout() {
  const { showWebsite, isTransitioning, setAppLoaded } = useTransition();
  const lenis = useLenis();

  const location = useLocation();

  // Stop lenis scrolling while preloader/transition is active
  useEffect(() => {
    if (lenis) {
      if (isTransitioning || !showWebsite) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [lenis, isTransitioning, showWebsite]);

  // Handle instant scrolling during transition if there is a hash
  useEffect(() => {
    if (location.hash && !showWebsite && lenis) {
      // We are transitioning to a page with a hash, and the website is currently hidden.
      // Wait a tiny bit for the new page components to mount.
      const timer = setTimeout(() => {
        lenis.resize(); // Let lenis recalculate maximum scroll height
        ScrollTrigger.refresh(); // Force GSAP to recalculate pins SYNCHRONOUSLY
        const id = location.hash.replace('#', '');
        const targetEl = document.getElementById(id);
        if (targetEl) {
          // Instantly jump to the target element without smooth scrolling
          lenis.scrollTo(targetEl, { immediate: true, force: true });
        }
      }, 300); // 300ms to ensure all components are fully mounted
      return () => clearTimeout(timer);
    }
  }, [location.hash, showWebsite, lenis]);

  // Fallback: Also scroll when the website is revealed to guarantee final layout heights
  useEffect(() => {
    if (location.hash && showWebsite && lenis) {
      const timer = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
        const id = location.hash.replace('#', '');
        const targetEl = document.getElementById(id);
        if (targetEl) {
          lenis.scrollTo(targetEl, { immediate: true, force: true });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [location.hash, showWebsite, lenis]);

  return (
    <div className="relative w-full min-h-screen text-white selection:bg-accent-purple/30 selection:text-white overflow-hidden font-sans bg-black">
      
      {/* Global Preloader for transitions */}
      <Preloader />

      {/* Main Website Reveal */}
      <motion.div
        initial={false}
        animate={showWebsite ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        onAnimationComplete={() => {
          if (showWebsite) {
             window.dispatchEvent(new Event('resize')); // Refresh ScrollTrigger after reveal
          }
        }}
        className={`w-full relative ${showWebsite ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        {/* Glassmorphism Floating Navbar */}
        <Navbar />

        {/* Global background lighting effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vh] bg-radial-gradient from-accent-purple/[0.04] to-transparent rounded-full blur-[120px] animate-float-blob" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-radial-gradient from-accent-purple/[0.04] to-transparent rounded-full blur-[120px] animate-float-blob-delayed" />
        </div>

        {/* Main page content (routed) */}
        <main className="relative z-10 w-full">
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home 
                setLoadProgress={() => {}} 
                setIsLoaded={(l) => {
                  if (l) setAppLoaded();
                }} 
                preloaderComplete={!isTransitioning && showWebsite} 
              />} />
              <Route path="/workflow" element={<WorkflowPage />} />
              <Route path="/faq" element={<FAQPage />} />
            </Routes>
          </Suspense>
        </main>

        {/* Premium footer */}
        <Footer />
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TransitionProvider>
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
          <Layout />
        </ReactLenis>
      </TransitionProvider>
    </BrowserRouter>
  );
}
