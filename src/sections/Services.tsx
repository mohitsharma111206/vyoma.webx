import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  Code2, 
  ShoppingBag, 
  PenTool, 
  Gauge, 
  Search, 
  ArrowRight
} from "lucide-react";
import { useTransition } from "../context/TransitionContext";

interface ServiceItem {
  icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  title: string;
  desc: string;
  tags: string[];
}

const services: ServiceItem[] = [
  {
    icon: Globe,
    title: "Corporate & Business Websites",
    desc: "Professional platforms engineered to establish authority, generate qualified leads, and convert traffic into revenue. Built for speed, credibility, and long-term scalability.",
    tags: ["High Conversion", "Mobile Optimized", "SEO Ready"]
  },
  {
    icon: Code2,
    title: "Custom Web Applications",
    desc: "Complex business logic transformed into intuitive digital products. We build secure, scalable applications that automate workflows and drive operational efficiency.",
    tags: ["Custom Development", "Automation", "Scalable"]
  },
  {
    icon: ShoppingBag,
    title: "E-Commerce Solutions",
    desc: "High-performance online stores engineered for seamless shopping experiences, secure transactions, and maximized conversion rates at scale.",
    tags: ["Digital Storefronts", "Secure Payments", "Inventory Sync"]
  },
  {
    icon: PenTool,
    title: "UI & UX Design",
    desc: "Data-driven interfaces designed to reduce friction and improve customer retention. We create premium aesthetics that strengthen brand positioning and trust.",
    tags: ["User Experience", "Design Systems", "Accessibility"]
  },
  {
    icon: Gauge,
    title: "Performance Optimization",
    desc: "We optimize websites for speed, responsiveness, and Core Web Vitals to deliver exceptional user experiences and improved search visibility.",
    tags: ["Fast Loading", "Core Web Vitals", "Optimization"]
  },
  {
    icon: Search,
    title: "Technical SEO",
    desc: "Build a strong SEO foundation with structured data, optimized architecture, semantic HTML, and technical improvements that help your website rank higher.",
    tags: ["Technical SEO", "Structured Data", "Google Ready"]
  }
];

function TiltCard({ service, index }: { service: ServiceItem; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const rafId = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (!rafId.current) {
      rafId.current = requestAnimationFrame(() => {
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;

        const maxTilt = 4; // Max tilt rotation in degrees
        const rotateX = -((y - height / 2) / height) * maxTilt;
        const rotateY = ((x - width / 2) / width) * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) translateY(-4px)`;
        
        // Move the glow spot using hardware acceleration instead of top/left
        const glow = card.querySelector(".card-glow") as HTMLDivElement;
        if (glow) {
          glow.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
          glow.style.opacity = "1";
        }
        rafId.current = null;
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    if (!card) return;

    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0)`;
    
    const glow = card.querySelector(".card-glow") as HTMLDivElement;
    if (glow) {
      glow.style.opacity = "0";
    }
  }, []);

  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
      className="h-full block"
    >
      <a
        href="#contact"
        ref={cardRef as any}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-card relative h-full p-8 md:p-10 rounded-3xl overflow-hidden flex flex-col justify-between cursor-pointer group bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-accent-purple/30 hover:shadow-[0_10px_40px_rgba(192,132,252,0.1)] block"
        style={{ transformStyle: "preserve-3d", transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease, background-color 0.4s ease" }}
      >
        {/* Animated Card Glow - Hardware accelerated via translate3d */}
        <div 
          className="card-glow absolute pointer-events-none rounded-full w-64 h-64 bg-accent-purple/15 blur-[60px] opacity-0 transition-opacity duration-300 will-change-transform"
          style={{ left: "0px", top: "0px", transform: "translate3d(-50%, -50%, 0)" }}
        />

        {/* Card Content */}
        <div className="relative z-10 select-none text-left flex-grow">
          
          {/* Header Row */}
          <div className="flex justify-between items-start mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5 text-white/70 group-hover:text-accent-purple group-hover:bg-accent-purple/10 group-hover:border-accent-purple/20 transition-all duration-500 shadow-sm">
              <Icon size={22} strokeWidth={1.5} className="group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ease-out" />
            </div>
            
            {/* Index number */}
            <span className="text-[10px] font-mono text-text-secondary/30 tracking-widest uppercase font-medium group-hover:text-accent-purple/50 transition-colors duration-300">
              0{index + 1}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-semibold font-geist text-white mb-4 tracking-wide group-hover:text-accent-purple/90 transition-colors duration-300">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-text-secondary leading-relaxed font-light tracking-wide mb-8 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            {service.desc}
          </p>

        </div>

        {/* Tags */}
        <div className="relative z-10 flex flex-col gap-6 mt-auto text-left">
          <div className="flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <span key={tag} className="text-[9px] font-mono tracking-widest text-text-secondary/70 uppercase bg-white/5 border border-white/5 px-2.5 py-1 rounded-md group-hover:border-white/10 group-hover:bg-white/10 transition-colors duration-300">
                {tag}
              </span>
            ))}
          </div>
        </div>

      </a>
    </motion.div>
  );
}

export default function Services() {
  const { navigateWithTransition } = useTransition();

  const handleCTA = (e: React.MouseEvent<HTMLAnchorElement>, target: string, isHash: boolean) => {
    e.preventDefault();
    if (isHash) {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigateWithTransition(target);
    }
  };

  return (
    <section id="services" className="relative w-full pt-48 pb-32 bg-transparent px-6 z-10 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute right-0 top-1/4 pointer-events-none bg-radial-gradient from-accent-purple/10 to-transparent rounded-full blur-[120px] w-[500px] h-[500px] opacity-40 animate-float-blob" />
      <div className="absolute left-[-10%] bottom-1/4 pointer-events-none bg-radial-gradient from-accent-purple/5 to-transparent rounded-full blur-[100px] w-96 h-96 opacity-30 animate-float-blob-delayed" />

      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-24 text-left relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block px-3 py-1 mb-6 rounded-full bg-accent-purple/10 border border-accent-purple/20"
          >
            <span className="text-[10px] tracking-[0.2em] uppercase text-accent-purple font-geist font-semibold">
              Our Capabilities
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-7xl font-semibold font-geist text-white tracking-tight leading-[1.1]"
          >
            Engineering <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50">Digital Growth.</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm md:text-lg text-text-secondary mt-8 max-w-2xl font-light tracking-wide leading-relaxed"
          >
            From high-converting corporate websites to complex scalable web applications, we build premium digital infrastructure that empowers ambitious brands to scale with absolute confidence.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {services.map((service, index) => (
            <TiltCard key={service.title} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA Block */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative"
        >
          {/* Subtle glow for the CTA area */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-accent-purple/5 to-transparent blur-[80px] pointer-events-none" />

          <div className="max-w-xl z-10">
            <h3 className="text-2xl md:text-3xl font-semibold font-geist text-white tracking-wide mb-3">
              Not Sure Which Solution Fits Your Business?
            </h3>
            <p className="text-sm md:text-base text-text-secondary font-light tracking-wide leading-relaxed">
              Every business is unique. We'll help you choose the right solution based on your goals, budget, and growth plans.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 z-10">
            <a 
              href="#contact" 
              onClick={(e) => handleCTA(e, "#contact", true)}
              className="px-8 py-4 rounded-full text-xs font-geist uppercase tracking-widest font-medium text-white border border-accent-purple/40 bg-accent-purple/10 hover:bg-accent-purple/20 transition-all duration-300 shadow-[0_0_15px_rgba(192,132,252,0.1)] hover:shadow-[0_0_25px_rgba(192,132,252,0.25)] flex items-center gap-2 group whitespace-nowrap cursor-pointer"
            >
              Book a Free Consultation
            </a>
            <a 
              href="/workflow" 
              onClick={(e) => handleCTA(e, "/workflow", false)}
              className="text-[11px] font-geist tracking-widest uppercase text-text-secondary hover:text-white transition-colors duration-300 flex items-center gap-1 group whitespace-nowrap cursor-pointer"
            >
              View Our Process <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
