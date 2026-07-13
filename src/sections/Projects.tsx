import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ProjectItem {
  num: string;
  title: string;
  category: string;
  image: string;
  desc: string;
  tech: string[];
  metrics: { label: string; value: string }[];
}

const projects: ProjectItem[] = [
  {
    num: "01",
    title: "AETHER",
    category: "Luxury E-Commerce",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    desc: "A high-end visual product platform designed with liquid animations, custom checkout micro-states, and immersive WebGL interfaces.",
    tech: ["React", "Three.js", "GSAP", "Tailwind"],
    metrics: [
      { label: "FID Rating", value: "Sub-8ms" },
      { label: "Lighthouse", value: "100/100" }
    ]
  },
  {
    num: "02",
    title: "KORTEX",
    category: "AI Spatial Dashboard",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
    desc: "A complex data engineering tool featuring custom charts, responsive layouts, fast load speeds, and real-time WebSockets integration.",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    metrics: [
      { label: "TTFB Response", value: "110ms" },
      { label: "Audit Rating", value: "Perfect" }
    ]
  },
  {
    num: "03",
    title: "VESPER",
    category: "Boutique FinTech",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop",
    desc: "An elegant, interactive platform for private wealth management, integrating secure APIs and custom-made SVG visualization systems.",
    tech: ["React", "Framer Motion", "Node.js", "Prisma"],
    metrics: [
      { label: "Visual Latency", value: "0ms" },
      { label: "Vulnerability", value: "0%" }
    ]
  },
  {
    num: "04",
    title: "NOVUS",
    category: "Editorial Design System",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop",
    desc: "A content-dense archive built for creative agencies, utilizing semantic typography scales, nested routing, and preloaded layouts.",
    tech: ["React", "Vite", "Tailwind", "Lucide Icons"],
    metrics: [
      { label: "Layout Shift (CLS)", value: "0.00" },
      { label: "Bundle weight", value: "14KB" }
    ]
  }
];

function ProjectCard({ project }: { project: ProjectItem }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const img = card.querySelector(".project-img") as HTMLImageElement;
    if (img) {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      const moveX = ((x - width / 2) / width) * 20;
      const moveY = ((y - height / 2) / height) * 20;

      img.style.transform = `scale(1.1) translate3d(${moveX}px, ${moveY}px, 0)`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    const img = card.querySelector(".project-img") as HTMLImageElement;
    if (img) {
      img.style.transform = "scale(1.02) translate3d(0, 0, 0)";
    }
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex-shrink-0 w-[85vw] md:w-[65vw] lg:w-[48vw] h-[68vh] rounded-[32px] overflow-hidden relative border border-white/5 bg-[#080808] group cursor-pointer"
      style={{ transition: "border-color 0.4s ease" }}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-transparent">
        <img 
          src={project.image} 
          alt={project.title}
          className="project-img w-full h-full object-cover opacity-30 transition-transform duration-700 ease-out scale-[1.02] filter grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 group-hover:opacity-40"
          loading="lazy"
        />
      </div>

      {/* Dark Overlay gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />



      {/* Content */}
      <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-between select-none">
        
        {/* Top bar info */}
        <div className="flex justify-between items-start">
          <span className="text-[10px] tracking-[0.3em] font-geist text-accent-purple uppercase font-medium">
            {project.category}
          </span>
          <span 
            className="text-[6rem] md:text-[8rem] font-bold leading-none select-none tracking-tighter opacity-10 group-hover:opacity-20 group-hover:text-accent-purple transition-all duration-500"
            style={{ 
              fontFamily: "var(--font-geist)", 
              WebkitTextStroke: "1px rgba(255,255,255,0.1)"
            }}
          >
            {project.num}
          </span>
        </div>

        {/* Bottom bar info */}
        <div className="text-left">
          <h3 className="text-2xl md:text-4xl font-semibold font-geist text-white tracking-widest uppercase mb-3 flex items-center gap-3">
            {project.title}
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out group-hover:bg-accent-purple group-hover:border-accent-purple">
              <ArrowUpRight size={14} className="text-white" />
            </div>
          </h3>
          <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-light tracking-wide max-w-sm mb-6">
            {project.desc}
          </p>



          <div className="flex flex-wrap gap-2 mt-4">
            {project.tech.map(t => (
              <span key={t} className="text-[9px] font-geist tracking-widest text-white border border-white/10 px-4 py-1.5 rounded-full uppercase bg-white/5 backdrop-blur-md">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  // Track scroll inside the Projects container
  const { scrollYProgress } = useScroll({
    target: targetRef
  });

  // Map scroll progress to horizontal translation
  // Moves cards leftwards as the user scrolls down
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-56%"]);

  return (
    <div id="projects" ref={targetRef} className="relative h-[250vh] bg-transparent">
      
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        {/* Title layer */}
        <div className="max-w-5xl mx-auto w-full px-6 mb-8 flex flex-col md:flex-row md:items-end justify-between select-none">
          <div className="text-left">
            <p className="text-xs tracking-[0.3em] uppercase text-accent-purple mb-4 font-geist">
              Portfolio
            </p>
            <h2 className="text-3xl md:text-5xl font-semibold font-geist text-white tracking-wide">
              Selected Creations.
            </h2>
          </div>
          <p className="text-xs md:text-sm text-text-secondary font-light tracking-wider max-w-xs mt-4 md:mt-0 leading-relaxed text-left">
            A gallery of high-end frontend systems designed with premium visual grids and pixel-perfect responsiveness.
          </p>
        </div>

        {/* Horizontal scroll track */}
        <div className="relative w-full flex items-center pl-[10vw]">
          <motion.div style={{ x }} className="flex gap-8 horizontal-scroll-container">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </motion.div>
        </div>

        {/* Progress indicator */}
        <div className="max-w-5xl mx-auto w-full px-6 mt-10 flex justify-between items-center text-[10px] font-geist tracking-[0.2em] text-white/40 select-none">
          <span>01 / 04</span>
          <div className="w-32 h-[1px] bg-white/5 relative">
            <motion.div 
              style={{ scaleX: scrollYProgress }} 
              className="absolute inset-0 bg-accent-purple origin-left"
            />
          </div>
          <span>Swipe / Scroll</span>
        </div>
      </div>
    </div>
  );
}
