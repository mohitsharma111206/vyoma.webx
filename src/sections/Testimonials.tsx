import { motion } from "framer-motion";
import { PenTool, Zap, Search, Eye, Layers, LifeBuoy, ArrowRight } from "lucide-react";
import Magnetic from "../components/Magnetic";

const features = [
  {
    icon: <PenTool size={20} />,
    title: "Uncompromising Quality",
    description: "We do not ship until the product meets our rigorous standards for design precision, performance, and accessibility."
  },
  {
    icon: <Search size={20} />,
    title: "Direct Collaboration",
    description: "Work directly with the engineers and designers building your product. No middle-management delays."
  },
  {
    icon: <Zap size={20} />,
    title: "Business-Centric",
    description: "Every technical and design decision is driven strictly by your specific growth targets and business objectives."
  },
  {
    icon: <Eye size={20} />,
    title: "Flawless Execution",
    description: "Predictable, milestone-based delivery with strict adherence to timelines and transparent project management."
  },
  {
    icon: <Layers size={20} />,
    title: "Modern Architecture",
    description: "We leverage enterprise-grade technologies to ensure your platform scales effortlessly from day one."
  },
  {
    icon: <LifeBuoy size={20} />,
    title: "Long-Term Partnership",
    description: "Beyond launch, we provide proactive maintenance and strategic enhancements to continuously drive ROI."
  }
];

export default function Testimonials() {
  return (
    <section className="relative w-full py-32 bg-transparent px-6 z-10 overflow-hidden" id="why-choose-us">
      {/* Subtle ambient light behind content */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-radial-gradient from-accent-purple/[0.03] to-transparent rounded-full blur-[120px] w-[800px] h-[800px] opacity-50 animate-float-blob" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20"
          >
            <span className="text-[10px] tracking-[0.2em] uppercase text-accent-purple font-geist font-semibold">
              The Vyoma Difference
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-geist font-bold tracking-tight text-white leading-tight"
          >
            Built With Absolute <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50">Commitment to Quality.</span>
          </motion.h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-8 md:p-10 rounded-[24px] relative group overflow-hidden border border-white/5 hover:border-accent-purple/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(168,85,247,0.15)] flex flex-col bg-white/[0.01] hover:bg-white/[0.03]"
            >
              {/* Hover Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent-purple/15 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/70 mb-8 group-hover:bg-accent-purple/10 group-hover:text-accent-purple group-hover:border-accent-purple/30 transition-all duration-500 shadow-sm relative z-10">
                <div className="group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 ease-out">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold font-geist text-white tracking-wide mb-4 relative z-10 group-hover:text-accent-purple/90 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-sm text-text-secondary leading-relaxed font-light font-geist relative z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center text-center space-y-8"
        >
          <h3 className="text-xl md:text-2xl font-geist font-medium text-white tracking-wide">
            Ready to Build Something Exceptional?
          </h3>
          <Magnetic range={30} strength={0.3}>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                const el = document.querySelector("#contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative px-8 py-4 rounded-full bg-white text-black font-geist text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <span className="relative z-10">Start Your Project</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </Magnetic>
        </motion.div>

      </div>
    </section>
  );
}
