import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, PenTool, Code2, ShieldCheck, Search, Rocket, ArrowRight } from "lucide-react";
import { useTransition } from "../context/TransitionContext";

gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
  num: string;
  title: string;
  desc: string;
  deliverables: string[];
  duration: string;
  icon: React.ElementType;
}

const steps: ProcessStep[] = [
  {
    num: "01",
    title: "Discovery & Architecture",
    desc: "We analyze your business objectives, target audience, and market positioning to engineer a comprehensive digital strategy and technical architecture.",
    deliverables: ["Strategic Roadmap", "Technical Architecture", "Competitive Analysis"],
    duration: "1–2 Days",
    icon: Compass
  },
  {
    num: "02",
    title: "Design & Prototyping",
    desc: "We design high-fidelity interfaces focusing on premium aesthetics, conversion optimization, and seamless user experiences across all devices.",
    deliverables: ["Wireframes & UX Flow", "High-Fidelity UI", "Interactive Prototype"],
    duration: "3–5 Days",
    icon: PenTool
  },
  {
    num: "03",
    title: "Engineering",
    desc: "Using modern frameworks, we develop secure, scalable, and highly performant applications with clean, maintainable code architectures.",
    deliverables: ["Custom Development", "API Integrations", "Database Architecture"],
    duration: "1–3 Weeks",
    icon: Code2
  },
  {
    num: "04",
    title: "Quality Assurance",
    desc: "Rigorous testing across devices and browsers ensures absolute reliability, flawless performance, and perfect accessibility compliance.",
    deliverables: ["Cross-Browser Testing", "Performance Audits", "Security Checks"],
    duration: "2–3 Days",
    icon: ShieldCheck
  },
  {
    num: "05",
    title: "Deployment & SEO",
    desc: "We execute a flawless launch sequence, configuring production environments and implementing strict technical SEO standards.",
    deliverables: ["Production Deployment", "Technical SEO", "Core Web Vitals"],
    duration: "1–2 Days",
    icon: Search
  },
  {
    num: "06",
    title: "Scale & Support",
    desc: "Post-launch, we provide ongoing maintenance, performance monitoring, and strategic enhancements to continuously drive growth.",
    deliverables: ["24/7 Monitoring", "Continuous Updates", "Growth Strategy"],
    duration: "Ongoing",
    icon: Rocket
  }
];

function StepCard({ step }: { step: ProcessStep }) {
  const Icon = step.icon;

  return (
    <div className="relative flex-shrink-0 w-full md:w-[420px] lg:w-[450px] md:mx-6 flex flex-col h-full">
      <div className="glass-card p-8 md:p-10 rounded-3xl relative text-left bg-white/[0.01] border border-white/5 hover:border-accent-purple/30 transition-colors duration-500 group overflow-hidden h-full mt-0 hover:bg-white/[0.03] hover:shadow-[0_15px_40px_rgba(192,132,252,0.15)] flex flex-col">
        
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-radial-gradient from-accent-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <span 
          className="text-6xl md:text-8xl font-bold text-white/5 absolute right-6 bottom-4 select-none pointer-events-none transition-colors duration-500 group-hover:text-white/10"
          style={{ fontFamily: "var(--font-geist)" }}
        >
          {step.num}
        </span>

        <div className="flex items-start mb-8 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5 text-white/70 shadow-sm transition-all duration-300 group-hover:bg-accent-purple/10 group-hover:text-accent-purple group-hover:border-accent-purple/20 group-hover:scale-110 group-hover:-rotate-3">
            <Icon size={22} strokeWidth={1.5} />
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-semibold font-geist text-white tracking-wide mb-4 relative z-10 group-hover:text-accent-purple/90 transition-colors">
          {step.title}
        </h3>

        <p className="text-sm text-text-secondary leading-relaxed font-light tracking-wide mb-8 opacity-80 relative z-10">
          {step.desc}
        </p>

        <div className="pt-6 border-t border-white/5 relative z-10 mt-auto">
          <span className="text-[9px] font-mono tracking-widest text-text-secondary/50 uppercase block mb-4">
            Key Deliverables
          </span>
          <div className="flex flex-col gap-3">
            {step.deliverables.map((del) => (
              <div key={del} className="flex items-center gap-3 p-2 -mx-2 rounded-lg cursor-default">
                <div className="w-4 h-4 rounded-full bg-accent-purple/10 flex items-center justify-center border border-accent-purple/20 group-hover:bg-accent-purple/20 group-hover:border-accent-purple/40 transition-colors duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-purple/60 group-hover:bg-accent-purple transition-colors duration-300" />
                </div>
                <span className="text-xs font-light tracking-wide text-text-secondary group-hover:text-white/90 transition-colors duration-300">
                  {del}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Process() {
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { navigateWithTransition } = useTransition();

  useEffect(() => {
    const pinWrapper = pinWrapperRef.current;
    const track = trackRef.current;
    if (!pinWrapper || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Calculate scroll distance: total width of track minus viewport width plus some padding
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + window.innerWidth * 0.2);

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: pinWrapper,
          start: "bottom bottom", // Pin when the bottom of the section is at the bottom of the screen so cards are fully visible
          end: () => `+=${track.scrollWidth}`, 
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      return () => tween.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="relative w-full bg-[#030303] overflow-hidden">
      
      {/* Background ambient */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-accent-purple/[0.02] to-transparent rounded-full blur-[120px] w-full h-full" />

      {/* Pinned Desktop Container / Normal Mobile Container */}
      {/* Added pt-32 for desktop as well to ensure space below navbar */}
      <div ref={pinWrapperRef} className="w-full pt-32 pb-16 md:pt-40 md:pb-20 md:min-h-screen md:flex md:flex-col md:justify-start">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 px-6 text-center select-none flex flex-col items-center shrink-0"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-accent-purple mb-4 font-geist font-medium">Workflow</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold font-geist text-white tracking-wide leading-tight mb-6">From Vision to Launch.</h2>
          <p className="text-sm md:text-base text-text-secondary mt-2 max-w-xl mx-auto font-light tracking-wide leading-relaxed">
            Every successful project follows a clear, transparent process. From understanding your business to launching your website, we collaborate closely at every stage to deliver exceptional results.
          </p>
        </motion.div>

        {/* Horizontal Track Container */}
        <div className="px-6 md:px-0 md:pl-[10vw] flex-grow flex flex-col justify-center">
          <div 
            ref={trackRef} 
            className="flex flex-col md:flex-row md:flex-nowrap md:w-max md:pr-[10vw] gap-8 md:gap-0 will-change-transform"
          >
            {steps.map((step) => (
              <StepCard key={step.num} step={step} />
            ))}
          </div>
        </div>

      </div>

    {/* CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 border-t border-white/5 pt-20 flex flex-col items-center text-center relative mt-12 mb-32 z-10"
      >
        <h3 className="text-3xl md:text-4xl font-semibold font-geist text-white tracking-wide mb-4 z-10">Ready to Bring Your Idea to Life?</h3>
        <p className="text-sm md:text-base text-text-secondary font-light tracking-wide leading-relaxed max-w-lg mb-10 z-10">Let's discuss your project and create a digital experience that helps your business grow.</p>
        <div className="flex flex-col sm:flex-row items-center gap-6 z-10">
          <a 
            href="/#contact" 
            onClick={(e) => { e.preventDefault(); navigateWithTransition("/#contact"); }} 
            className="px-10 py-5 rounded-full text-xs font-geist uppercase tracking-widest font-medium text-white border border-accent-purple/40 bg-accent-purple/10 hover:bg-accent-purple/20 transition-all shadow-[0_0_20px_rgba(192,132,252,0.15)] flex items-center gap-2 group cursor-pointer"
          >
            Start Your Project
          </a>
          <a 
            href="/#contact" 
            onClick={(e) => { e.preventDefault(); navigateWithTransition("/#contact"); }} 
            className="text-[11px] font-geist tracking-widest uppercase text-text-secondary hover:text-white transition-colors duration-300 flex items-center gap-1.5 group cursor-pointer"
          >
            Schedule a Free Consultation <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </motion.div>

    </div>
  );
}
