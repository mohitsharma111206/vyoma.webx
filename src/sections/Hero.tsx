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

// Global flag to enable diagnostics (either in DEV or by appending ?debug to URL)
const IS_DEV = import.meta.env.DEV || (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("debug"));

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

  // ---------------------------------------------------------
  // DIAGNOSTICS STATE & REFS
  // ---------------------------------------------------------
  const [, setForceUpdate] = useState({});
  const diag = useRef({
    // Frame Timing
    frameTimes: [] as number[],
    avgRenderTime: 0,
    worstRenderTime: 0,
    longestIn5s: 0,
    last5sTimes: [] as { time: number; timestamp: number }[],
    // Canvas Draw Timing
    lastDrawTime: 0,
    // Loading Status
    loadedFrames: 0,
    decodedFrames: 0,
    missingFrames: 0,
    currentFrame: 0,
    targetFrame: 0,
    // GSAP
    gsapProgress: 0,
    // Canvas Res
    canvasInternalW: 0,
    canvasInternalH: 0,
    canvasCssW: 0,
    canvasCssH: 0,
    dpr: typeof window !== "undefined" ? window.devicePixelRatio : 1,
    // Memory
    memoryUsed: 0,
    memoryLimit: 0,
    // Device
    concurrency: typeof navigator !== "undefined" ? navigator.hardwareConcurrency : 0,
    deviceMemory: typeof navigator !== "undefined" ? (navigator as any).deviceMemory : 0,
    connection: typeof navigator !== "undefined" ? (navigator as any).connection?.effectiveType : "unknown",
    // Resize
    resizeCount: 0,
    lastViewportHeight: typeof window !== "undefined" ? window.innerHeight : 0,
    isDesktopMode: typeof window !== "undefined" ? window.innerWidth > 900 : false,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : ""
  });

  // Diagnostics Tick Loop
  useEffect(() => {
    if (!IS_DEV) return;
    const interval = setInterval(() => {
      // Clean up 5s history
      const now = performance.now();
      diag.current.last5sTimes = diag.current.last5sTimes.filter((t) => now - t.timestamp < 5000);
      diag.current.longestIn5s = diag.current.last5sTimes.reduce((max, t) => Math.max(max, t.time), 0);

      // Memory
      if ((performance as any).memory) {
        diag.current.memoryUsed = (performance as any).memory.usedJSHeapSize / (1024 * 1024);
        diag.current.memoryLimit = (performance as any).memory.jsHeapSizeLimit / (1024 * 1024);
      }

      // Canvas sizes
      if (canvasRef.current) {
        diag.current.canvasInternalW = canvasRef.current.width;
        diag.current.canvasInternalH = canvasRef.current.height;
        diag.current.canvasCssW = canvasRef.current.clientWidth;
        diag.current.canvasCssH = canvasRef.current.clientHeight;
      }
      
      // Loaded count
      diag.current.loadedFrames = framesRef.current.filter((f) => f !== null).length;
      diag.current.missingFrames = totalFrames - diag.current.loadedFrames;

      setForceUpdate({});
    }, 500); // update HUD twice a second
    return () => clearInterval(interval);
  }, []);

  // Resize Detector
  useEffect(() => {
    if (!IS_DEV) return;
    const handleResize = () => {
      diag.current.resizeCount++;
      diag.current.lastViewportHeight = window.innerHeight;
      diag.current.isDesktopMode = window.innerWidth > 900;
      setForceUpdate({});
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // ---------------------------------------------------------


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
            // Force browser to decode image (prevent draw stall)
            await img.decode();
            framesRef.current[index] = img;
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

      // 2. Load remaining frames continuously
      let currentIndex = criticalFramesCount;
      const loadNextChunk = () => {
        if (isCancelled || currentIndex >= totalFrames) return;
        
        const chunk = [];
        const chunkSize = 15; 
        for (let i = 0; i < chunkSize && currentIndex < totalFrames; i++, currentIndex++) {
          chunk.push(loadFrame(currentIndex));
        }
        
        Promise.all(chunk).then(() => {
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
    const frameStart = performance.now();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let ctx = ctxRef.current;
    if (!ctx) {
      ctx = canvas.getContext("2d", { alpha: false, desynchronized: true }) as CanvasRenderingContext2D;
      ctxRef.current = ctx;
    }
    if (!ctx) return;

    let targetIndex = index;
    while (!framesRef.current[targetIndex] && targetIndex > 0) {
       targetIndex--;
    }

    if (lastDrawnFrameRef.current === targetIndex) return; 

    const frame = framesRef.current[targetIndex];
    if (frame) {
      const drawStart = performance.now();
      ctx.drawImage(frame as CanvasImageSource, 0, 0, canvas.width, canvas.height);
      const drawEnd = performance.now();
      
      lastDrawnFrameRef.current = targetIndex;

      if (IS_DEV) {
        diag.current.currentFrame = targetIndex;
        diag.current.lastDrawTime = drawEnd - drawStart;
      }
    }

    if (IS_DEV) {
      const frameTotalTime = performance.now() - frameStart;
      diag.current.frameTimes.push(frameTotalTime);
      if (diag.current.frameTimes.length > 60) diag.current.frameTimes.shift(); // keep rolling avg small
      diag.current.avgRenderTime = diag.current.frameTimes.reduce((a, b) => a + b, 0) / diag.current.frameTimes.length;
      diag.current.worstRenderTime = Math.max(diag.current.worstRenderTime, frameTotalTime);
      diag.current.last5sTimes.push({ time: frameTotalTime, timestamp: performance.now() });
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

  // 2. Set up ScrollTrigger timeline
  useEffect(() => {
    if (!preloaderComplete || !loaded || !containerRef.current || !pinnedRef.current || !textWrapperRef.current) return;

    // Force touch scrolling onto the main thread to prevent iOS compositor jitter
    // We strictly limit this to mobile/touch screens, because normalizeScroll fights with 
    // desktop trackpads and mousewheels, causing the pinned container to violently "flicker up".
    if (window.innerWidth < 1024) {
      ScrollTrigger.normalizeScroll(true);
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, 
        pin: pinnedRef.current,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (IS_DEV) {
            diag.current.gsapProgress = self.progress;
          }
        }
      }
    });

    const animData = { frame: 0 };

    tl.to(animData, {
      frame: totalFrames - 1,
      snap: "frame",
      ease: "none",
      duration: 8,
      onUpdate: () => {
        if (IS_DEV) diag.current.targetFrame = Math.round(animData.frame);
        drawFrame(Math.round(animData.frame));
      }
    }, 0);

    tl.to(textWrapperRef.current, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      ease: "power1.out",
      duration: 2,
      onStart: () => {
        if (textWrapperRef.current) textWrapperRef.current.style.pointerEvents = "auto";
      },
      onReverseComplete: () => {
        if (textWrapperRef.current) textWrapperRef.current.style.pointerEvents = "none";
      }
    }, 8);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [loaded, preloaderComplete, drawFrame]);

  // Track scroll position passively
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
      className="relative w-full h-[150svh] bg-transparent"
    >
      {/* Pinned Viewport Container */}
      <div 
        ref={pinnedRef}
        className="w-full h-[100svh] overflow-hidden bg-transparent relative"
      >
        <div 
          ref={logoWrapperRef} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-10 will-change-transform flex items-center justify-center"
        >
          <canvas 
            ref={canvasRef} 
            className="w-[280px] h-[265px] md:w-[400px] md:h-[378px] block object-contain pointer-events-none select-none relative z-10" 
            style={{
              background: "black",
              // mixBlendMode: "screen", // PHASE 2 COMPOSITING TEST
              transform: "translateZ(0)"
            }}
          />
        </div>

        <div 
          ref={textWrapperRef} 
          className="absolute inset-0 mx-auto w-full max-w-4xl px-6 flex flex-col items-center pointer-events-none select-none z-10 will-change-transform"
          style={{ 
            filter: "blur(12px)", 
            transform: "translateY(50px)"
          }}
        >
          {/* Exact mathematical spacer to place the center of the VYOMA text precisely at 50svh */}
          <div className="h-[calc(50svh-18px)] md:h-[calc(50svh-30px)] w-full shrink-0" />
          
          <div className="flex items-center justify-center gap-3 md:gap-4 w-full relative z-20 leading-none">
            <span className="text-sm md:text-lg font-light tracking-wide text-white font-geist uppercase mt-0.5 md:mt-1">
              EST.
            </span>
            <h1 
              className="text-4xl md:text-6xl font-bold tracking-tight text-white font-geist uppercase leading-none"
              style={{ textShadow: "0 0 40px rgba(255,255,255,0.4)" }}
            >
              VYOMA
            </h1>
            <span className="text-sm md:text-lg font-light tracking-wide text-white font-geist uppercase mt-0.5 md:mt-1">
              2026
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl font-geist font-medium text-white tracking-wide mt-6 mb-2 relative z-20">
            Premium Websites Built to Drive Growth.
          </h2>

          <p className="max-w-xl text-sm md:text-base text-text-secondary leading-relaxed tracking-wide mb-10 font-light mt-4 mx-auto relative z-20">
            We engineer high-performance digital experiences that elevate your brand and convert visitors into customers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-4 w-full px-2 relative z-20">
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

      {/* --------------------------------------------------------- */}
      {/* DEVELOPMENT DIAGNOSTICS OVERLAY                           */}
      {/* --------------------------------------------------------- */}
      {IS_DEV && (
        <div className="fixed top-0 left-0 w-full md:w-[350px] bg-black/90 border-r border-b border-white/20 text-[#00FF00] font-mono text-[10px] p-4 z-[9999] pointer-events-none overflow-hidden max-h-screen">
          <h3 className="font-bold text-white mb-2 pb-1 border-b border-white/20 uppercase tracking-widest text-xs">
            Hero Diagnostics {diag.current.isDesktopMode ? "[DESKTOP MODE]" : "[MOBILE MODE]"}
          </h3>
          
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-3">
            <div className="text-white/60">Frame Avg:</div>
            <div>{diag.current.avgRenderTime.toFixed(2)} ms</div>
            
            <div className="text-white/60">Frame Worst:</div>
            <div className="text-red-400">{diag.current.worstRenderTime.toFixed(2)} ms</div>
            
            <div className="text-white/60">Longest (5s):</div>
            <div className="text-yellow-400">{diag.current.longestIn5s.toFixed(2)} ms</div>
            
            <div className="text-white/60">Draw ctx:</div>
            <div>{diag.current.lastDrawTime.toFixed(2)} ms</div>
          </div>

          <h4 className="font-bold text-white/80 mt-2 mb-1 border-b border-white/10 pb-1">Loading Status</h4>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-3">
            <div className="text-white/60">Total Frames:</div>
            <div>{totalFrames}</div>
            
            <div className="text-white/60">Loaded:</div>
            <div className={diag.current.loadedFrames === totalFrames ? "text-green-400" : "text-yellow-400"}>
              {diag.current.loadedFrames}
            </div>
            
            <div className="text-white/60">Missing:</div>
            <div>{diag.current.missingFrames}</div>
            
            <div className="text-white/60">Current Frame:</div>
            <div>{diag.current.currentFrame}</div>
            
            <div className="text-white/60">Target Frame:</div>
            <div>{diag.current.targetFrame}</div>
          </div>

          <h4 className="font-bold text-white/80 mt-2 mb-1 border-b border-white/10 pb-1">GSAP</h4>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-3">
            <div className="text-white/60">Progress:</div>
            <div>{(diag.current.gsapProgress * 100).toFixed(1)}%</div>
          </div>

          <h4 className="font-bold text-white/80 mt-2 mb-1 border-b border-white/10 pb-1">Resolution</h4>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-3">
            <div className="text-white/60">Viewport:</div>
            <div>{typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : ""}</div>

            <div className="text-white/60">CSS Canvas:</div>
            <div>{diag.current.canvasCssW}x{diag.current.canvasCssH}</div>
            
            <div className="text-white/60">Int Canvas:</div>
            <div>{diag.current.canvasInternalW}x{diag.current.canvasInternalH}</div>
            
            <div className="text-white/60">DPR:</div>
            <div>{diag.current.dpr}</div>
          </div>

          <h4 className="font-bold text-white/80 mt-2 mb-1 border-b border-white/10 pb-1">System (If Supported)</h4>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-3">
            <div className="text-white/60">Resizes:</div>
            <div className={diag.current.resizeCount > 0 ? "text-yellow-400" : ""}>{diag.current.resizeCount} (Last H: {diag.current.lastViewportHeight})</div>

            <div className="text-white/60">Cores:</div>
            <div>{diag.current.concurrency}</div>
            
            <div className="text-white/60">RAM Class:</div>
            <div>{diag.current.deviceMemory}GB</div>
            
            <div className="text-white/60">Network:</div>
            <div>{diag.current.connection}</div>
            
            <div className="text-white/60">JS Heap:</div>
            <div>{diag.current.memoryUsed ? `${diag.current.memoryUsed.toFixed(1)}MB / ${diag.current.memoryLimit.toFixed(0)}MB` : "N/A"}</div>
          </div>

          <div className="mt-2 text-[8px] text-white/30 break-all leading-tight">
            UA: {diag.current.userAgent}
          </div>
        </div>
      )}
    </div>
  );
}
