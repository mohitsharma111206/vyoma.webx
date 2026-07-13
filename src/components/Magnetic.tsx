import { useRef, useEffect, cloneElement } from "react";
import type { ReactElement } from "react";
import gsap from "gsap";

interface MagneticProps {
  children: ReactElement;
  range?: number;
  strength?: number;
}

export default function Magnetic({ children, range = 50, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.3)", force3D: true });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.3)", force3D: true });

    let rect: DOMRect | null = null;
    let rafId: number | null = null;
    let mouseX = 0;
    let mouseY = 0;
    let isIntersecting = false;

    // Only process calculations if element is actually visible on screen
    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (entry.isIntersecting) {
        rect = el.getBoundingClientRect();
      }
    }, { rootMargin: `${range}px` }); // add range as margin so it activates before entering
    
    observer.observe(el);

    const updateRect = () => {
      if (isIntersecting) {
        rect = el.getBoundingClientRect();
      }
    };

    const calculateMovement = () => {
      if (!rect || !isIntersecting) {
        rafId = null;
        return;
      }
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < range) {
        xTo(dx * strength);
        yTo(dy * strength);
      } else {
        xTo(0);
        yTo(0);
      }
      rafId = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isIntersecting) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(calculateMovement);
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    // Passive listeners, minimal main-thread footprint
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", updateRect, { passive: true });
    window.addEventListener("scroll", updateRect, { passive: true });
    el.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [range, strength]);

  return cloneElement(children, { ref } as any);
}
