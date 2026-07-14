import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "../components/Magnetic";
import { ArrowDown, ArrowUpRight } from "lucide-react";

// Register ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  setLoadProgress: (progress: number) => void;
  setIsLoaded: (loaded: boolean) => void;
  preloaderComplete: boolean;
}

export default function Hero({ setLoadProgress, setIsLoaded, preloaderComplete }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  const totalFrames = 300;
  const framesRef = useRef<(HTMLCanvasElement | ImageBitmap | HTMLImageElement | null)[]>(new Array(totalFrames).fill(null));

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastDrawnFrameRef = useRef<number>(-1);

  // 1. Preload and alpha-mask JPG sequence efficiently
  useEffect(() => {
    let loadedCount = 0;
    let isCancelled = false;
    const criticalFramesCount = 20;

    const loadFrame = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (framesRef.current[index]) return resolve(); // Skip if already loaded
        
        const img = new Image();
        const frameStr = String(index + 1).padStart(3, "0");
        img.src = `/Frames/ezgif-frame-${frameStr}.jpg`;

        img.onload = async () => {
          if (isCancelled) return resolve();
          try {
            if (window.createImageBitmap) {
              const bitmap = await window.createImageBitmap(img);
              framesRef.current[index] = bitmap;
            } else {
              // Fallback for older browsers: force async decode
              await img.decode();
              framesRef.current[index] = img;
            }
          } catch (e) {
            framesRef.current[index] = img; // Fallback silently
          }
          loadedCount++;
          if (index < criticalFramesCount && !isCancelled) { 
            setLoadProgress(Math.round((loadedCount / criticalFramesCount) * 100));
          }
          resolve();
        };

        img.onerror = () => {
           loadedCount++;
           resolve();
        };
      });
    };

    const loadSequence = async () => {
      // 1. Load initial critical frames
      const initialBatch = [];
      for (let i = 0; i < criticalFramesCount; i++) {
        initialBatch.push(loadFrame(i));
      }
      await Promise.all(initialBatch);
      
      if (!isCancelled) {
        setLoaded(true);
        setIsLoaded(true); 
      }

      // 2. Load remaining frames continuously in larger chunks
      let currentIndex = criticalFramesCount;
      const loadNextChunk = () => {
        if (isCancelled || currentIndex >= totalFrames) return;
        
        const chunk = [];
        const chunkSize = 15; // Increase concurrency for faster loading on HTTP/2
        for (let i = 0; i < chunkSize && currentIndex < totalFrames; i++, currentIndex++) {
          chunk.push(loadFrame(currentIndex));
        }
        
        Promise.all(chunk).then(() => {
           // Continue loading next chunk without waiting for idle time
           setTimeout(loadNextChunk, 10);
        });
      };
      
      setTimeout(loadNextChunk, 50);
    };

    loadSequence();

    return () => {
      isCancelled = true;
    };
  }, [setLoadProgress, setIsLoaded]);

  // Draw specific processed frame on main canvas
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let ctx = ctxRef.current;
    if (!ctx) {
      // Use alpha: false for huge perf boost, and desynchronized for low latency
      ctx = canvas.getContext("2d", { alpha: false, desynchronized: true }) as CanvasRenderingContext2D;
      ctxRef.current = ctx;
    }
    if (!ctx) return;

    let targetIndex = index;
    while (!framesRef.current[targetIndex] && targetIndex > 0) {
       targetIndex--;
    }

    if (lastDrawnFrameRef.current === targetIndex) return; // Skip redundant draw

    const frame = framesRef.current[targetIndex];
    if (frame) {
      // No clearRect needed because alpha: false and JPGs are fully opaque
      ctx.drawImage(frame as CanvasImageSource, 0, 0, canvas.width, canvas.height);
      lastDrawnFrameRef.current = targetIndex;
    }
  }, []);

  // Draw first frame as soon as loaded
  useEffect(() => {
    if (loaded && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 512;
      canvas.height = 484;
      drawFrame(0);
    }
  }, [loaded, drawFrame]);

  // 2. Set up ScrollTrigger timeline (uses passive listener underneath by GSAP)
  useEffect(() => {
    if (!preloaderComplete || !loaded || !containerRef.current || !pinnedRef.current || !textWrapperRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Increased from 0.1 for Apple-like 60fps smooth inertia
        pin: pinnedRef.current,
        pinSpacing: true,
        anticipatePin: 1
      }
    });

    const animData = { frame: 0 };

    // 0-80% scroll: Scrub frames
    tl.to(animData, {
      frame: totalFrames - 1,
      snap: "frame",
      ease: "none",
      duration: 8,
      onUpdate: () => {
        drawFrame(Math.round(animData.frame));
      }
    }, 0);

    // 80-100% scroll: Reveal typography and buttons
    tl.to(textWrapperRef.current, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      ease: "power1.out",
      duration: 2,
      onStart: () => {
        if (textWrapperRef.current) {
          textWrapperRef.current.style.pointerEvents = "auto";
        }
      },
      onReverseComplete: () => {
        if (textWrapperRef.current) {
          textWrapperRef.current.style.pointerEvents = "none";
        }
      }
    }, 8);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [loaded, preloaderComplete, drawFrame]);

  // Track scroll position passively to hide scroll indicator
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolledDown(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCTA = useCallback((e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div 
      id="home"
      ref={containerRef} 
      className="relative w-full h-[150vh] bg-transparent"
    >
      {/* Pinned Viewport Container */}
      <div 
        ref={pinnedRef}
        className="w-full h-screen overflow-hidden bg-transparent relative"
      >
        {/* Soft Ambient lighting in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-radial-gradient from-accent-purple/10 to-transparent rounded-full blur-[100px] w-[500px] h-[500px] opacity-35 z-0 will-change-transform" />

        {/* 100% Transparent absolute center logo wrapper */}
        <div 
          ref={logoWrapperRef} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-10 will-change-transform flex items-center justify-center"
          <canvas 
            ref={canvasRef} 
            className="w-[280px] h-[265px] md:w-[400px] md:h-[378px] block object-contain pointer-events-none select-none relative z-10" 
            style={{
              background: "black",
              mixBlendMode: "screen", // Compositor-level blending (extremely fast)
              transform: "translateZ(0)" // Force GPU layer
            }}
          />
        </div>

        {/* Text reveal container (centered, absolute underneath logo) */}
        <div 
          ref={textWrapperRef} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-6 flex flex-col items-center justify-center text-center opacity-0 pointer-events-none select-none z-10 will-change-transform"
          style={{ 
            filter: "blur(12px)", 
            transform: "translate3d(0, 50px, 0)"
          }}
        >
          {/* Main Title Wrapper */}
          <div className="flex items-center justify-center gap-3 md:gap-4 w-full">
            <span className="text-sm md:text-lg font-light tracking-wide text-white font-geist uppercase mt-0.5 md:mt-1">
              EST.
            </span>
            <h1 
              className="text-4xl md:text-6xl font-bold tracking-tight text-white font-geist uppercase"
              style={{ textShadow: "0 0 40px rgba(255,255,255,0.4)" }}
            >
              VYOMA
            </h1>
            <span className="text-sm md:text-lg font-light tracking-wide text-white font-geist uppercase mt-0.5 md:mt-1">
              2026
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl font-geist font-medium text-white tracking-wide mt-6 mb-2">
            Premium Websites Built to Drive Growth.
          </h2>

          {/* Description */}
          <p className="max-w-xl text-sm md:text-base text-text-secondary leading-relaxed tracking-wide mb-10 font-light mt-4 mx-auto">
            We engineer high-performance digital experiences that elevate your brand and convert visitors into customers.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-4 w-full px-2">
            <Magnetic range={30} strength={0.35}>
              <a
                href="#contact"
                onClick={(e) => handleCTA(e, "#contact")}
                className="w-full sm:w-auto relative px-6 py-3.5 md:px-8 md:py-4 rounded-full text-[10px] md:text-xs font-geist uppercase tracking-widest text-black bg-white transition-all duration-500 flex items-center justify-center gap-2 cursor-pointer border border-white hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap will-change-transform"
              >
                Start Your Project <ArrowUpRight size={16} />
              </a>
            </Magnetic>

            <Magnetic range={30} strength={0.35}>
              <a
                href="#services"
                onClick={(e) => handleCTA(e, "#services")}
                className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 rounded-full text-[10px] md:text-xs font-geist uppercase tracking-widest text-white transition-all duration-500 flex items-center justify-center gap-2 cursor-pointer border border-white/20 hover:border-white/50 hover:bg-white/5 backdrop-blur-md whitespace-nowrap will-change-transform"
              >
                Explore Solutions
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <div 
          ref={scrollIndicatorRef}
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary/40 text-[9px] uppercase tracking-[0.3em] font-geist pointer-events-none transition-opacity duration-500 will-change-transform ${
            isScrolledDown ? "opacity-0" : "opacity-100"
          }`}
        >
          <span>Scroll to explore</span>
          <ArrowDown size={12} className="animate-bounce" />
        </div>

      </div>
    </div>
  );
}
