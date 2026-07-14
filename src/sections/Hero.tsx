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

// --------------------------------------------------
// UTILS: Hardware Detection
// --------------------------------------------------
const getDeviceCapabilities = () => {
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  // @ts-ignore
  const deviceMemory = navigator.deviceMemory || 4;
  
  const isLowEnd = hardwareConcurrency <= 4 || deviceMemory <= 4;
  
  return {
    isLowEnd,
    maxConcurrentDownloads: isLowEnd ? 4 : 10,
    dpr: Math.min(window.devicePixelRatio || 1, isLowEnd ? 2 : 3),
    cacheWindowSize: isLowEnd ? 40 : 80 // Frames to keep in memory before dropping
  };
};

// --------------------------------------------------
// UTILS: Frame Provider Abstraction
// --------------------------------------------------
type FrameType = ImageBitmap | HTMLImageElement | null;

class ImageSequenceProvider {
  private totalFrames: number;
  private cache = new Map<number, FrameType>();
  private loadingQueue = new Set<number>();
  private activeDownloads = 0;
  private capabilities = getDeviceCapabilities();
  private onProgress: (loaded: number) => void;
  private criticalFramesLoaded = 0;
  private criticalCount = 20;
  private basePath = "/Frames/ezgif-frame-";

  constructor(totalFrames: number, onProgress: (p: number) => void) {
    this.totalFrames = totalFrames;
    this.onProgress = onProgress;
  }

  getFrame(index: number): FrameType | undefined {
    return this.cache.get(index);
  }

  // Preload priority based on current frame and direction
  manageCache(currentFrame: number, scrollDirection: number) {
    // 1. Evict distant frames to save memory
    const windowHalf = this.capabilities.cacheWindowSize / 2;
    const minKeep = currentFrame - windowHalf;
    const maxKeep = currentFrame + windowHalf;

    for (const key of this.cache.keys()) {
      if (key < minKeep || key > maxKeep) {
        const frame = this.cache.get(key);
        // Explicitly close ImageBitmaps to free GPU VRAM immediately
        if (frame && 'close' in frame) {
          (frame as ImageBitmap).close();
        }
        this.cache.delete(key);
      }
    }

    // 2. Queue upcoming frames
    // Determine priority array based on scroll direction
    const loadRadius = 25; // How far ahead to look
    let priorityQueue: number[] = [];

    if (scrollDirection >= 0) {
      for (let i = currentFrame; i <= currentFrame + loadRadius && i < this.totalFrames; i++) {
        if (!this.cache.has(i) && !this.loadingQueue.has(i)) priorityQueue.push(i);
      }
    } else {
      for (let i = currentFrame; i >= currentFrame - loadRadius && i >= 0; i--) {
        if (!this.cache.has(i) && !this.loadingQueue.has(i)) priorityQueue.push(i);
      }
    }

    priorityQueue.forEach(idx => this.loadingQueue.add(idx));
    this.processQueue();
  }

  private processQueue() {
    if (this.activeDownloads >= this.capabilities.maxConcurrentDownloads || this.loadingQueue.size === 0) return;

    // Grab highest priority (first in set, which was added in directional order)
    const nextIndex = this.loadingQueue.keys().next().value;
    if (nextIndex === undefined) return;
    this.loadingQueue.delete(nextIndex);

    this.activeDownloads++;
    
    this.downloadAndDecode(nextIndex).finally(() => {
      this.activeDownloads--;
      this.processQueue();
    });
  }

  private async downloadAndDecode(index: number): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      const frameStr = String(index + 1).padStart(3, "0");
      img.src = `${this.basePath}${frameStr}.jpg`;

      img.onload = async () => {
        try {
          // Offscreen decode using ImageBitmap if supported
          if (window.createImageBitmap) {
            const bitmap = await window.createImageBitmap(img);
            this.cache.set(index, bitmap);
          } else {
            await img.decode();
            this.cache.set(index, img);
          }
        } catch (e) {
          this.cache.set(index, img);
        }

        if (index < this.criticalCount) {
          this.criticalFramesLoaded++;
          this.onProgress(Math.round((this.criticalFramesLoaded / this.criticalCount) * 100));
        }
        resolve();
      };

      img.onerror = () => {
         // Fail silently but resolve queue
         resolve();
      };
    });
  }

  // Preload initial batch
  async preloadCritical() {
    for (let i = 0; i < this.criticalCount; i++) {
      this.loadingQueue.add(i);
    }
    // Boost concurrency for initial load to get to TTI faster
    const originalConcurrency = this.capabilities.maxConcurrentDownloads;
    this.capabilities.maxConcurrentDownloads = 15;
    this.processQueue();
    
    // Simple poll until critical are loaded
    return new Promise<void>((resolve) => {
      const check = setInterval(() => {
        if (this.criticalFramesLoaded >= this.criticalCount) {
          clearInterval(check);
          this.capabilities.maxConcurrentDownloads = originalConcurrency;
          resolve();
        }
      }, 50);
    });
  }
}

// --------------------------------------------------
// HERO COMPONENT
// --------------------------------------------------
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
  
  // Animation state (mutated directly for performance)
  const animState = useRef({
    currentFrame: 0,
    targetFrame: 0,
    lastDrawnFrame: -1,
    scrollDirection: 1, // 1 for down, -1 for up
    isVisible: true
  });

  const providerRef = useRef<ImageSequenceProvider | null>(null);
  const rAFRef = useRef<number | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // 1. Initialize Provider & Critical Load
  useEffect(() => {
    providerRef.current = new ImageSequenceProvider(totalFrames, setLoadProgress);
    
    providerRef.current.preloadCritical().then(() => {
      setLoaded(true);
      setIsLoaded(true);
    });

    return () => {
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, [setLoadProgress, setIsLoaded]);

  // 2. Setup Canvas Context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loaded) return;

    // Use desynchronized for lower latency, alpha false for faster blending
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true }) as CanvasRenderingContext2D;
    ctxRef.current = ctx;

    const capabilities = getDeviceCapabilities();
    canvas.width = 512 * capabilities.dpr;
    canvas.height = 484 * capabilities.dpr;

    // Initial draw
    drawFrame(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  // 3. Render Loop (rAF)
  const drawFrame = useCallback((index: number) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    const provider = providerRef.current;
    if (!ctx || !canvas || !provider) return;

    let targetIdx = index;
    // Fallback to nearest loaded frame if scrolling faster than network
    while (!provider.getFrame(targetIdx) && targetIdx > 0) {
      targetIdx--;
    }

    if (animState.current.lastDrawnFrame === targetIdx) return; // Avoid redundant redraws

    const frame = provider.getFrame(targetIdx);
    if (frame) {
      ctx.drawImage(frame as CanvasImageSource, 0, 0, canvas.width, canvas.height);
      animState.current.lastDrawnFrame = targetIdx;
    }
  }, []);

  const renderLoop = useCallback(() => {
    if (!animState.current.isVisible) return;

    const state = animState.current;

    // Linear interpolation for smooth Apple-like inertia
    // Faster lerp if delta is large, otherwise it feels sluggish
    const diff = state.targetFrame - state.currentFrame;
    if (Math.abs(diff) > 0.1) {
      state.currentFrame += diff * 0.15; // Interpolation factor
    } else {
      state.currentFrame = state.targetFrame;
    }

    const roundedFrame = Math.round(state.currentFrame);
    
    // Inform provider of current position for memory management
    providerRef.current?.manageCache(roundedFrame, state.scrollDirection);

    // Draw
    drawFrame(roundedFrame);

    rAFRef.current = requestAnimationFrame(renderLoop);
  }, [drawFrame]);

  // Manage visibility to pause render loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !loaded) return;

    const observer = new IntersectionObserver((entries) => {
      const isIntersecting = entries[0].isIntersecting;
      animState.current.isVisible = isIntersecting;
      
      if (isIntersecting && !rAFRef.current) {
        rAFRef.current = requestAnimationFrame(renderLoop);
      } else if (!isIntersecting && rAFRef.current) {
        cancelAnimationFrame(rAFRef.current);
        rAFRef.current = null;
      }
    }, { rootMargin: "200px" });

    observer.observe(container);

    const handleVisibilityChange = () => {
      if (document.hidden && rAFRef.current) {
        cancelAnimationFrame(rAFRef.current);
        rAFRef.current = null;
      } else if (!document.hidden && animState.current.isVisible) {
        rAFRef.current = requestAnimationFrame(renderLoop);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, [loaded, renderLoop]);

  // 4. GSAP ScrollTrigger Integration
  useEffect(() => {
    if (!preloaderComplete || !loaded || !containerRef.current || !pinnedRef.current || !textWrapperRef.current) return;

    // The GSAP timeline just updates targetFrame, it does not draw!
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0, // We handle inertia manually in rAF loop
        pin: pinnedRef.current,
        pinSpacing: true,
        anticipatePin: 1
      }
    });

    const dummy = { frame: 0 };

    // 0-80% scroll: Scrub frames
    tl.to(dummy, {
      frame: totalFrames - 1,
      ease: "none",
      duration: 8,
      onUpdate: () => {
        const newTarget = dummy.frame;
        // Calculate direction
        animState.current.scrollDirection = newTarget > animState.current.targetFrame ? 1 : -1;
        animState.current.targetFrame = newTarget;
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
  }, [loaded, preloaderComplete]);

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
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div 
      id="home"
      ref={containerRef} 
      className="relative w-full h-[150vh] bg-transparent"
    >
      <div 
        ref={pinnedRef}
        className="w-full h-screen overflow-hidden bg-transparent relative"
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
              mixBlendMode: "screen", // GPU Compositor blending
              transform: "translateZ(0)" // Force GPU layer
            }}
          />
        </div>

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

          <p className="max-w-xl text-sm md:text-base text-text-secondary leading-relaxed tracking-wide mb-10 font-light mt-4 mx-auto">
            We engineer high-performance digital experiences that elevate your brand and convert visitors into customers.
          </p>

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
