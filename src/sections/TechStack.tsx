import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Terminal, Shield, Zap, Layout, Search, Layers } from "lucide-react";

interface CapabilityItem {
  title: string;
  desc: string;
  poweredByLabel: string;
  technologies: string[];
  depth: number; // Parallax depth factor
  snippet: string;
  icon: React.ElementType;
}

const capabilities: CapabilityItem[] = [
  {
    title: "Performance",
    desc: "Fast-loading websites optimized for Core Web Vitals, responsive interactions, and exceptional user experience.",
    poweredByLabel: "Powered By",
    technologies: ["Next.js", "React", "Image Optimization", "CDN"],
    depth: 0.15,
    snippet: "import Image from 'next/image';",
    icon: Zap
  },
  {
    title: "Scalable Architecture",
    desc: "Modern application architecture designed to grow with your business and support future expansion.",
    poweredByLabel: "Powered By",
    technologies: ["Node.js", "TypeScript", "Prisma", "PostgreSQL"],
    depth: 0.08,
    snippet: "const prisma = new PrismaClient();",
    icon: Layers
  },
  {
    title: "SEO Foundation",
    desc: "Technical SEO built into every project for better search visibility and long-term growth.",
    poweredByLabel: "Includes",
    technologies: ["Schema Markup", "Semantic HTML", "Metadata", "Sitemap"],
    depth: 0.12,
    snippet: "<script type=\"application/ld+json\">",
    icon: Search
  },
  {
    title: "Interactive Experiences",
    desc: "Beautiful animations and smooth interactions that make every website memorable without sacrificing performance.",
    poweredByLabel: "Powered By",
    technologies: ["GSAP", "Framer Motion", "Three.js"],
    depth: 0.18,
    snippet: "gsap.to(card, { y: -10, duration: 0.5 });",
    icon: Layout
  },
  {
    title: "Security",
    desc: "Secure authentication, encrypted communication, and modern best practices to protect your business and customers.",
    poweredByLabel: "Features",
    technologies: ["SSL", "Secure APIs", "Authentication", "Best Practices"],
    depth: 0.1,
    snippet: "app.use(helmet.contentSecurityPolicy());",
    icon: Shield
  },
  {
    title: "Cross-Platform",
    desc: "Responsive experiences that work seamlessly across desktop, tablet, and mobile devices.",
    poweredByLabel: "Features",
    technologies: ["Mobile First", "Responsive Layouts", "Browser Compatibility"],
    depth: 0.14,
    snippet: "@media (max-width: 768px)",
    icon: Terminal
  }
];

function FloatingTechBox({ item, mouseX, mouseY, index }: { item: CapabilityItem; mouseX: any; mouseY: any; index: number }) {
  // Parallax calculations based on depth
  const x = useTransform(mouseX, (mx: number) => mx * item.depth * 18);
  const y = useTransform(mouseY, (my: number) => my * item.depth * 18);

  const springConfig = { stiffness: 120, damping: 25 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ x: smoothX, y: smoothY }}
      className="glass-card p-8 rounded-3xl flex flex-col h-full border border-white/5 bg-[#080808]/80 hover:bg-[#0c0c0c]/90 hover:border-accent-purple/40 transition-all duration-500 relative group cursor-pointer overflow-hidden select-none hover:shadow-[0_15px_50px_rgba(192,132,252,0.15)]"
    >
      {/* Background ambient lighting on hover */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-accent-purple/10 to-transparent blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-accent-purple/0 via-accent-purple/[0.05] to-accent-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Visual top indicator */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5 text-white/50 group-hover:text-accent-purple group-hover:bg-accent-purple/10 group-hover:border-accent-purple/20 transition-all duration-500 shadow-sm">
          <Icon size={20} strokeWidth={1.5} className="group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 ease-out" />
        </div>
      </div>

      {/* Main Text */}
      <div className="text-left mb-8 relative z-10">
        <h3 className="text-xl md:text-2xl font-semibold font-geist text-white tracking-wide mb-3 group-hover:text-accent-purple/90 transition-colors duration-300">
          {item.title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed font-light tracking-wide opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          {item.desc}
        </p>
      </div>

      {/* Technologies List */}
      <div className="mt-auto pt-6 border-t border-white/5 text-left relative z-10">
        <span className="text-[9px] font-mono tracking-widest text-text-secondary/50 uppercase block mb-4">
          {item.poweredByLabel}:
        </span>
        <div className="flex flex-wrap gap-2">
          {item.technologies.map((tech) => (
            <span 
              key={tech} 
              className="text-[10px] font-geist tracking-wide text-text-secondary/80 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg group-hover:border-accent-purple/20 group-hover:bg-accent-purple/5 transition-all duration-300 shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function TechStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom Motion values for mouse offsets from the center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Normalised mouse offset from the center (-1 to 1)
    const mx = (e.clientX - centerX) / (width / 2);
    const my = (e.clientY - centerY) / (height / 2);

    mouseX.set(mx);
    mouseY.set(my);
  };

  const handleMouseLeave = () => {
    // Return smoothly to center
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
      id="tech" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-32 bg-transparent px-6 z-10 overflow-hidden"
    >
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-accent-purple/[0.02] to-transparent rounded-full blur-[120px] w-full h-full" />

      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-24 text-left max-w-3xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block px-3 py-1 mb-6 rounded-full bg-accent-purple/10 border border-accent-purple/20"
          >
            <span className="text-[10px] tracking-[0.2em] uppercase text-accent-purple font-geist font-semibold">
              Technical Infrastructure
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold font-geist text-white tracking-tight leading-[1.1] mb-8"
          >
            Built for Scale, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50">Engineered for Performance.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm md:text-lg text-text-secondary font-light tracking-wide leading-relaxed"
          >
            We don't just build websites; we engineer digital assets. By leveraging modern, enterprise-grade frameworks, we ensure your platform is exceptionally fast, highly secure, and capable of scaling seamlessly as your business grows. The result is a premium user experience that converts traffic into revenue.
          </motion.p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr relative z-10">
          {capabilities.map((item, index) => (
            <FloatingTechBox 
              key={item.title} 
              item={item} 
              mouseX={mouseX} 
              mouseY={mouseY}
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
