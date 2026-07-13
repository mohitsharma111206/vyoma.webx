import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface TransitionContextType {
  navigateWithTransition: (to: string) => void;
  isTransitioning: boolean;
  showWebsite: boolean;
  setShowWebsite: (show: boolean) => void;
  setAppLoaded: () => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export const useTransition = () => useContext(TransitionContext)!;

export const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isTransitioning, setIsTransitioning] = useState(true); // True on initial load
  const [showWebsite, setShowWebsite] = useState(false);
  const [prevPath, setPrevPath] = useState("");
  const [appLoaded, setAppLoadedState] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Expose function to signal that initial heavy assets (like Hero images) are loaded
  const setAppLoaded = () => setAppLoadedState(true);

  // Handle initial load
  useEffect(() => {
    setPrevPath(location.pathname);
    
    // If not on the homepage, there are no heavy assets to load, so mark as loaded immediately
    if (location.pathname !== "/") {
      setAppLoadedState(true);
    }
  }, [location.pathname]);

  // When appLoaded becomes true, begin the preloader exit sequence
  useEffect(() => {
    if (appLoaded && isTransitioning && !showWebsite) {
      // Small artificial delay to ensure the pulsing animation has time to be seen
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setTimeout(() => setShowWebsite(true), 800); // Wait for preloader fade out
      }, 500); 
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appLoaded]);

  // Handle browser back/forward buttons (popstate)
  useEffect(() => {
    if (prevPath && location.pathname !== prevPath) {
      if (showWebsite) {
        // Triggered by back/forward button natively
        setShowWebsite(false);
        setTimeout(() => {
          setIsTransitioning(true);
          setTimeout(() => {
            setIsTransitioning(false);
            setTimeout(() => {
              setShowWebsite(true);
            }, 800);
          }, 1500);
        }, 500);
      }
      setPrevPath(location.pathname);
    }
  }, [location.pathname, prevPath, showWebsite]);

  const navigateWithTransition = (to: string) => {
    if (isTransitioning || !showWebsite) return; // Prevent double clicks during transition
    
    const toPath = to.split('#')[0] || "/";
    const currentPath = location.pathname;
    const hash = to.split('#')[1];
    
    if (toPath === currentPath) {
       // Same page navigation, just scroll
       if (hash) {
         window.history.pushState({}, '', to);
         const targetEl = document.getElementById(hash);
         if (targetEl) {
           targetEl.scrollIntoView({ behavior: "smooth" });
         }
       } else {
         window.scrollTo({ top: 0, behavior: "smooth" });
         navigate(to);
       }
       return;
    }

    // Different route -> Trigger cinematic transition
    setShowWebsite(false); // Fade out current page (including Navbar)
    
    setTimeout(() => {
      setIsTransitioning(true); // Show preloader
      
      // Perform actual route change while hidden
      navigate(to);
      
      // Keep preloader up for the signature animation
      setTimeout(() => {
        setIsTransitioning(false); // Hide preloader
        
        // Wait for preloader to fully fade out, then fade in destination page
        setTimeout(() => {
          setShowWebsite(true);
        }, 800);
        
      }, 1500); // Preloader visible duration
      
    }, 600); // Time it takes for website to fade out
  };

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning, showWebsite, setShowWebsite, setAppLoaded }}>
      {children}
    </TransitionContext.Provider>
  );
};
