import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import Magnetic from "../components/Magnetic";
import { useTransition } from "../context/TransitionContext";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: "General",
    items: [
      {
        question: "How long does a project take?",
        answer: (
          <div className="space-y-4">
            <p>Every project is tailored to your unique requirements, but here are our typical delivery timelines:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-purple/50 mt-1.5 shrink-0" />
                <span><strong className="font-medium text-white/90">Landing Pages:</strong> Around 3–5 business days</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-purple/50 mt-1.5 shrink-0" />
                <span><strong className="font-medium text-white/90">Business Websites:</strong> Usually 1–2 weeks</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-purple/50 mt-1.5 shrink-0" />
                <span><strong className="font-medium text-white/90">E-commerce Websites:</strong> Typically 2–3 weeks</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-purple/50 mt-1.5 shrink-0" />
                <span><strong className="font-medium text-white/90">Custom Web Applications:</strong> Timeline depends on the project's scope, features, integrations, and overall complexity.</span>
              </li>
            </ul>
            <p>Before development begins, we'll provide a clear project roadmap with estimated milestones and delivery dates, ensuring complete transparency throughout the process.</p>
          </div>
        )
      },
      {
        question: "How much does a website cost?",
        answer: "Every project is custom-scoped based on your specific needs. After our initial consultation, we provide a detailed technical proposal with transparent pricing and milestone-based payment schedules."
      },
      {
        question: "Can you redesign my existing website?",
        answer: "Yes. We frequently transition businesses from outdated platforms to modern, high-performance architectures while preserving and improving existing SEO equity."
      },
      {
        question: "Do you work with international clients?",
        answer: "Absolutely. We serve ambitious brands globally, maintaining seamless communication across time zones through clear milestones and regular updates."
      }
    ]
  },
  {
    title: "Services",
    items: [
      {
        question: "Do you build custom websites?",
        answer: "Yes. Every website we engineer is custom-built from the ground up tailored to your brand identity and business objectives, avoiding generic templates entirely."
      },
      {
        question: "Do you build web applications?",
        answer: "Yes. We engineer highly complex, interactive web applications using modern frameworks like React, ensuring speed, scalability, and exceptional user experiences."
      },
      {
        question: "Can you create e-commerce websites?",
        answer: "Yes. We build high-converting e-commerce experiences tailored to your products, focusing on fast checkouts, secure payments, and seamless inventory integration."
      }
    ]
  },
  {
    title: "SEO & Performance",
    items: [
      {
        question: "Will my website be SEO optimized?",
        answer: "Yes. Technical SEO is foundational to our process. We integrate semantic HTML, optimized meta tags, structured data, and clean architecture to ensure maximum search engine visibility."
      },
      {
        question: "Will it be mobile responsive?",
        answer: "Absolutely. We engineer with a mobile-first philosophy, ensuring your digital product delivers a flawless, responsive experience across smartphones, tablets, and ultra-wide displays."
      },
      {
        question: "How fast will the website be?",
        answer: "Performance is our priority. We heavily optimize images, leverage modern rendering techniques, and utilize efficient code architectures to ensure near-instant load times and excellent Core Web Vitals."
      }
    ]
  },
  {
    title: "Hosting",
    items: [
      {
        question: "Do you provide hosting?",
        answer: "We deploy your application on enterprise-grade edge networks (such as Vercel or AWS) to guarantee global scalability, security, and lightning-fast content delivery."
      },
      {
        question: "Do you help with domain registration?",
        answer: "Yes. If needed, we can assist in acquiring and configuring your domain name, ensuring proper DNS setup and SSL certificate provisioning."
      },
      {
        question: "Do you offer maintenance?",
        answer: "Yes. We offer dedicated maintenance retainers to ensure your website remains secure, up-to-date, and continually optimized post-launch."
      }
    ]
  },
  {
    title: "Support",
    items: [
      {
        question: "Can I update the website myself?",
        answer: "Yes. We can integrate modern, intuitive Content Management Systems (CMS) tailored to your workflow, allowing your team to update content effortlessly without touching code."
      },
      {
        question: "Do you provide ongoing support?",
        answer: "Yes. We believe in long-term partnerships. Post-launch, we are available for technical support, feature expansions, and strategic digital consulting."
      },
      {
        question: "What happens after launch?",
        answer: "After launch, we monitor the platform closely for any issues, ensure all analytics are firing correctly, and seamlessly hand over the keys (or transition into an ongoing support retainer)."
      }
    ]
  }
];

export default function FAQPage() {
  const { navigateWithTransition } = useTransition();
  // Store open state as a string combining category index and item index
  const [openId, setOpenId] = useState<string | null>("0-0");

  const toggleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Clean Intro Section */}
        <div className="mb-20 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl font-geist font-bold tracking-tight text-white leading-tight mb-6"
          >
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple via-accent-purple/80 to-white/50">Questions.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-text-secondary leading-relaxed tracking-wide font-light"
          >
            Everything you need to know about working with Vyoma—from project timelines and pricing to hosting, maintenance, and ongoing support.
          </motion.p>
        </div>

        {/* Categorized Accordions */}
        <div className="space-y-16">
          {faqCategories.map((category, catIdx) => (
            <div key={category.title} className="space-y-6">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-xl font-geist font-semibold tracking-wide text-white/90 border-b border-white/10 pb-4"
              >
                {category.title}
              </motion.h2>

              <div className="flex flex-col gap-4">
                {category.items.map((faq, itemIdx) => {
                  const id = `${catIdx}-${itemIdx}`;
                  const isOpen = openId === id;
                  
                  return (
                    <motion.div
                      key={faq.question}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: itemIdx * 0.05 }}
                      className="group relative"
                    >
                      {/* Glow Behind */}
                      {isOpen && (
                        <div className="absolute inset-0 bg-accent-purple/5 blur-xl pointer-events-none transition-opacity duration-500" />
                      )}

                      <div 
                        className={`glass-card border transition-all duration-500 rounded-2xl overflow-hidden cursor-pointer relative z-10 bg-[#080808] hover:bg-[#0c0c0c] ${isOpen ? 'border-accent-purple/40 shadow-[0_5px_30px_rgba(168,85,247,0.1)]' : 'border-white/5 hover:border-white/10'}`}
                        onClick={() => toggleOpen(id)}
                      >
                        <div className="flex items-center justify-between p-6 md:p-8">
                          <h3 className={`text-base md:text-lg font-geist tracking-wide transition-colors duration-300 ${isOpen ? 'text-accent-purple font-medium' : 'text-white font-medium group-hover:text-white/80'}`}>
                            {faq.question}
                          </h3>
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? 'border-accent-purple bg-accent-purple/10 text-accent-purple rotate-180' : 'border-white/10 text-white/50 bg-white/[0.02]'}`}>
                            <ChevronDown size={16} />
                          </div>
                        </div>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0, filter: "blur(4px)" }}
                              animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
                              exit={{ height: 0, opacity: 0, filter: "blur(4px)" }}
                              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            >
                              <div className="px-6 md:px-8 pb-8 text-sm text-text-secondary leading-relaxed font-light tracking-wide border-t border-white/5 pt-6 mt-2">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 mb-10 text-center glass-card border border-white/10 p-12 rounded-3xl relative overflow-hidden bg-gradient-to-b from-[#080808] to-[#030303]"
        >
          <div className="absolute inset-0 bg-radial-gradient from-accent-purple/10 to-transparent blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
            <h3 className="text-3xl font-geist font-bold tracking-tight text-white mb-4">
              Still Have Questions?
            </h3>
            <p className="text-text-secondary font-light tracking-wide mb-10">
              We're happy to discuss your project and answer any questions you may have.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Magnetic range={20} strength={0.2}>
                <a
                  href="/#contact"
                  onClick={(e) => { e.preventDefault(); navigateWithTransition("/#contact"); }}
                  className="group relative px-8 py-4 rounded-full bg-white text-black font-geist text-sm font-medium tracking-wide flex items-center justify-center gap-2 overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  <span className="relative z-10">Start Your Project</span>
                </a>
              </Magnetic>
              <a
                href="/#contact"
                onClick={(e) => { e.preventDefault(); navigateWithTransition("/#contact"); }}
                className="group px-8 py-4 rounded-full bg-transparent border border-white/10 text-white font-geist text-sm font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                Contact Us 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
