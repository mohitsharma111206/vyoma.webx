import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Magnetic from "../components/Magnetic";
import { useTransition } from "../context/TransitionContext";

export default function FAQCTA() {
  const { navigateWithTransition } = useTransition();

  return (
    <section className="relative w-full py-24 bg-transparent px-6 z-10 overflow-hidden" id="faq-cta">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card border border-white/10 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden bg-[#080808]"
        >
          {/* Ambient inner glow */}
          <div className="absolute inset-0 bg-radial-gradient from-accent-purple/5 to-transparent blur-xl pointer-events-none" />

          <div className="max-w-xl z-10 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-geist font-bold tracking-tight text-white mb-3">
              Need More Information?
            </h3>
            <p className="text-text-secondary text-sm font-light tracking-wide leading-relaxed">
              Find answers about pricing, timelines, hosting, maintenance, and our development process.
            </p>
          </div>

          <div className="z-10 shrink-0">
            <Magnetic range={20} strength={0.2}>
              <a
                href="/faq"
                onClick={(e) => { e.preventDefault(); navigateWithTransition("/faq"); }}
                className="group relative px-8 py-4 rounded-full bg-white text-black font-geist text-sm font-medium tracking-wide flex items-center justify-center gap-2 overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span className="relative z-10">Visit FAQ</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
