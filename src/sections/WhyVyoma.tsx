import { motion } from "framer-motion";
import { Zap, Search, Shield, Cpu, LayoutGrid, CheckCircle2 } from "lucide-react";

export default function WhyVyoma() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section id="about" className="relative w-full py-32 bg-transparent px-6 z-10 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute right-0 bottom-0 pointer-events-none bg-radial-gradient from-accent-purple/5 to-transparent rounded-full blur-[120px] w-96 h-96 opacity-40" />

      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-20 text-left">
          <p className="text-xs tracking-[0.3em] uppercase text-accent-purple mb-4 font-geist">
            Why Vyoma
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold font-geist text-white tracking-wide">
            Built for Growth.
          </h2>
          <p className="text-sm md:text-base text-text-secondary mt-4 max-w-xl font-light tracking-wide leading-relaxed">
            Every website we build is engineered to load faster, rank higher, and convert more visitors into customers. Beautiful design backed by exceptional performance.
          </p>
        </div>

        {/* Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]"
        >
          
          {/* Box 1: Large Stats Box (Spans 2 columns, 2 rows) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 row-span-2 glass-card bg-grid p-8 md:p-10 rounded-3xl flex flex-col justify-between border border-white/5 relative group overflow-hidden"
          >
            {/* Visual background circular graph */}
            <div className="absolute right-[-5%] bottom-[-5%] w-72 h-72 rounded-full border border-accent-purple/10 flex items-center justify-center pointer-events-none group-hover:border-accent-purple/20 transition-colors duration-500">
              <div className="w-56 h-56 rounded-full border border-accent-purple/5" />
            </div>

            <div className="text-left select-none z-10">
              <span className="text-[9px] font-mono tracking-[0.3em] text-accent-purple uppercase">
                // Performance Engineering
              </span>
              <h3 className="text-3xl md:text-5xl font-bold font-geist text-white tracking-tight mt-6 mb-3">
                Fast. Reliable. Conversion Focused.
              </h3>
              <p className="text-xs md:text-sm text-text-secondary font-light max-w-md tracking-wide leading-relaxed">
                Every Vyoma.Webx website is optimized for Core Web Vitals, responsive performance, clean architecture, accessibility, and exceptional user experience across every device.
              </p>
            </div>

            {/* Performance Indicators */}
            <div className="flex flex-row flex-wrap items-center gap-4 z-10 my-4 select-none">
              {[
                { label: "Speed Optimized" },
                { label: "Mobile First" },
                { label: "SEO Ready" },
                { label: "Secure" }
              ].map((indicator) => (
                <div key={indicator.label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 group-hover:border-accent-purple/30 transition-colors">
                  <CheckCircle2 size={14} className="text-accent-purple" />
                  <span className="text-xs font-medium font-geist tracking-wide text-white">{indicator.label}</span>
                </div>
              ))}
            </div>

            {/* Bottom Metrics */}
            <div className="grid grid-cols-3 gap-6 z-10 border-t border-white/5 pt-8 text-left select-none">
              <div>
                <span className="text-lg md:text-xl font-semibold font-geist text-white tracking-wider">Core Web Vitals</span>
                <span className="text-[9px] font-mono tracking-widest text-text-secondary uppercase block mt-1">Optimized</span>
              </div>
              <div>
                <span className="text-lg md:text-xl font-semibold font-geist text-white tracking-wider">Global CDN</span>
                <span className="text-[9px] font-mono tracking-widest text-text-secondary uppercase block mt-1">Delivery</span>
              </div>
              <div>
                <span className="text-lg md:text-xl font-semibold font-geist text-white tracking-wider">SSL Protected</span>
                <span className="text-[9px] font-mono tracking-widest text-text-secondary uppercase block mt-1">Security</span>
              </div>
            </div>
          </motion.div>

          {/* Box 2: Lightning Fast Widget */}
          <motion.div 
            variants={itemVariants}
            className="glass-card p-8 rounded-3xl flex flex-col justify-between border border-white/5 text-left group cursor-pointer relative overflow-hidden"
          >
            {/* Speedometer simulated visual */}
            <div className="absolute right-[-10%] top-[-10%] w-24 h-24 border border-white/5 rounded-full flex items-center justify-center opacity-40 group-hover:border-accent-purple/10 transition-colors duration-500">
              <div className="w-16 h-16 border border-white/5 rounded-full" />
              <div className="absolute bottom-1/2 left-1/2 w-[2px] h-10 bg-accent-purple origin-bottom rotate-45 group-hover:rotate-[120deg] transition-transform duration-700 ease-out" />
            </div>

            <div className="w-10 h-10 rounded-xl bg-white/3 flex items-center justify-center text-accent-purple border border-white/5 z-10">
              <Zap size={18} />
            </div>
            <div className="z-10">
              <h4 className="text-lg font-medium font-geist text-white mb-2 tracking-wider">
                Lightning Fast
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed font-light tracking-wide mb-4">
                Optimized assets, intelligent caching, lazy loading, and modern development practices ensure your visitors never wait.
              </p>
              {/* Load timer widget */}
              <div className="flex items-center gap-2 bg-white/2 border border-white/5 rounded-lg px-3 py-1.5 w-max">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                <span className="text-[10px] font-mono tracking-wider text-green-400 font-medium">FAST LOADING</span>
              </div>
            </div>
          </motion.div>

          {/* Box 3: SEO Google Snippet Preview */}
          <motion.div 
            variants={itemVariants}
            className="glass-card p-6 md:p-8 rounded-3xl flex flex-col justify-between border border-white/5 text-left group cursor-pointer relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-white/3 flex items-center justify-center text-accent-purple border border-white/5 z-10 shrink-0">
              <Search size={18} />
            </div>
            <div className="z-10 mt-2 space-y-2">
              <div>
                <h4 className="text-base md:text-lg font-medium font-geist text-white mb-1 tracking-wider">
                  Search Engine Ready
                </h4>
                <p className="text-[11px] md:text-xs text-text-secondary leading-snug font-light tracking-wide">
                  Technical SEO, structured data, semantic HTML, optimized metadata, XML sitemaps, and clean code help your business get discovered.
                </p>
              </div>
              
              {/* Mini Checklist */}
              <div className="grid grid-cols-2 gap-1.5 mt-2 select-none transform group-hover:-translate-y-1 transition-transform duration-500">
                {["Metadata", "Schema", "Sitemap", "Robots.txt"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-geist text-white/80 bg-white/5 border border-white/5 rounded px-2 py-1">
                    <CheckCircle2 size={10} className="text-accent-purple" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Box 4: Scalable Architecture Node Visual */}
          <motion.div 
            variants={itemVariants}
            className="glass-card p-8 rounded-3xl flex flex-col justify-between border border-white/5 text-left group cursor-pointer relative overflow-hidden"
          >
            {/* Visual connected nodes background */}
            <div className="absolute right-4 bottom-4 flex gap-4 pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity duration-500">
              <svg className="w-20 h-20" viewBox="0 0 100 100">
                <line x1="20" y1="50" x2="50" y2="20" stroke="white" strokeWidth="1" />
                <line x1="20" y1="50" x2="50" y2="80" stroke="white" strokeWidth="1" />
                <line x1="50" y1="20" x2="80" y2="50" stroke="white" strokeWidth="1" />
                <line x1="50" y1="80" x2="80" y2="50" stroke="white" strokeWidth="1" />
                <circle cx="20" cy="50" r="4" fill="#c084fc" />
                <circle cx="50" cy="20" r="4" fill="white" />
                <circle cx="50" cy="80" r="4" fill="white" />
                <circle cx="80" cy="50" r="4" fill="#c084fc" className="animate-pulse" />
              </svg>
            </div>

            <div className="w-10 h-10 rounded-xl bg-white/3 flex items-center justify-center text-accent-purple border border-white/5 z-10">
              <Shield size={18} />
            </div>
            <div className="z-10">
              <h4 className="text-lg font-medium font-geist text-white mb-2 tracking-wider">
                Built to Scale
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed font-light tracking-wide">
                Whether you're launching your first business website or expanding into a large digital platform, your website grows with your business.
              </p>
            </div>
          </motion.div>

          {/* Box 5: Modern Tech Stack Visual */}
          <motion.div 
            variants={itemVariants}
            className="glass-card p-8 rounded-3xl flex flex-col justify-between border border-white/5 text-left group cursor-pointer relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-white/3 flex items-center justify-center text-accent-purple border border-white/5 z-10">
              <Cpu size={18} />
            </div>
            <div className="z-10 space-y-4">
              <div>
                <h4 className="text-lg font-medium font-geist text-white mb-2 tracking-wider">
                  Modern Technology
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed font-light tracking-wide">
                  Built with industry-leading technologies that deliver speed, security, maintainability, and long-term scalability.
                </p>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-2 select-none group-hover:border-accent-purple/20 transition-all duration-500">
                {["Next.js", "React", "TypeScript", "Tailwind CSS"].map((tech) => (
                  <span key={tech} className="bg-white/5 border border-white/10 text-white/90 text-[10px] font-mono px-2 py-1 rounded-md">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Box 6: Pixel Perfect Figma Visual */}
          <motion.div 
            variants={itemVariants}
            className="glass-card p-8 rounded-3xl flex flex-col justify-between border border-white/5 text-left group cursor-pointer relative overflow-hidden"
          >
            {/* Figma-style Crosshairs (Alignment lines) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
              {/* Horizontal line */}
              <div className="figma-line left-0 right-0 h-[1px]" style={{ top: "35%" }} />
              {/* Vertical line */}
              <div className="figma-line top-0 bottom-0 w-[1px]" style={{ left: "60%" }} />
              {/* Width label box */}
              <div className="absolute top-[28%] left-[63%] bg-accent-purple text-black text-[7px] font-mono font-bold px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                W: 400px
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-white/3 flex items-center justify-center text-accent-purple border border-white/5 z-10">
              <LayoutGrid size={18} />
            </div>
            <div className="z-10">
              <h4 className="text-lg font-medium font-geist text-white mb-2 tracking-wider">
                Pixel Perfect Experience
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed font-light tracking-wide">
                Every layout, interaction, animation, and spacing is carefully refined to create a premium experience that builds trust and increases conversions.
              </p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
