import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransition } from "../context/TransitionContext";

export default function Preloader() {
  const { isTransitioning } = useTransition();

  useEffect(() => {
    if (isTransitioning) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isTransitioning]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col items-center justify-center touch-none"
        >
          <div className="flex items-center justify-center gap-3 md:gap-4 w-full opacity-70 animate-pulse">
            <span className="text-xs md:text-sm font-light tracking-[0.2em] text-white font-geist uppercase mt-0.5 md:mt-1">
              EST.
            </span>
            <h1 
              className="text-2xl md:text-3xl font-bold tracking-widest text-white font-geist uppercase"
              style={{ textShadow: "0 0 20px rgba(255,255,255,0.2)" }}
            >
              VYOMA
            </h1>
            <span className="text-xs md:text-sm font-light tracking-[0.2em] text-white font-geist uppercase mt-0.5 md:mt-1">
              2026
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
