import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import Magnetic from "./Magnetic";
import { useTransition } from "../context/TransitionContext";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Services", href: "/#services" },
  { label: "Workflow", href: "/workflow" },
  { label: "About", href: "/#about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/#contact" }
];

export default function Navbar() {
  const location = useLocation();
  const { navigateWithTransition, isTransitioning } = useTransition();
  const [activeSection, setActiveSection] = useState("Home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHoveringLink, setIsHoveringLink] = useState<string | null>(null);

  // Track scroll for shrinking and active section (only on homepage for sections)
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);

          if (location.pathname === "/") {
            let currentSection = "Home";
            for (const link of navLinks) {
              if (link.href.startsWith("/#")) {
                const sectionId = link.href.replace('/#', '');
                const section = document.getElementById(sectionId);
                if (section) {
                  const rect = section.getBoundingClientRect();
                  if (rect.top <= window.innerHeight / 3) {
                    currentSection = link.label;
                  }
                }
              }
            }
            setActiveSection(currentSection);
          } else {
            // If we are on /faq, set active section to FAQ
            const currentLink = navLinks.find(link => link.href === location.pathname);
            if (currentLink) {
              setActiveSection(currentLink.label);
            } else {
              setActiveSection(""); // Reset if not matching
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    e.preventDefault();
    if (isTransitioning) return;
    
    setMobileMenuOpen(false);
    setActiveSection(label);
    
    navigateWithTransition(href);
  }, [isTransitioning, navigateWithTransition]);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none px-4 pt-6"
      >
        <motion.div
          animate={{
            width: isScrolled ? "90%" : "95%",
            maxWidth: isScrolled ? "900px" : "1100px",
            y: isScrolled ? 0 : 4,
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto relative flex items-center justify-between"
        >
          {/* Main Floating Container */}
          <div className={`w-full flex items-center justify-between px-4 md:px-6 py-3 rounded-full transition-all duration-500 border overflow-hidden ${
            isScrolled 
              ? "bg-[#050505]/70 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]" 
              : "bg-[#050505]/40 backdrop-blur-xl border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
          }`}>
            
            {/* Ambient inner glow */}
            <div className="absolute inset-0 pointer-events-none rounded-full bg-gradient-to-r from-white/0 via-white/[0.03] to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-700" />

            {/* Logo */}
            <a 
              href="/#home" 
              onClick={(e) => handleLinkClick(e, "/#home", "Home")} 
              className={`flex items-center gap-2.5 group relative z-10 pl-2 md:pl-0 ${isTransitioning ? 'pointer-events-none' : ''}`}
            >
              <span className="text-lg font-semibold tracking-wide text-white font-geist group-hover:text-white/90 transition-colors">
                Vyoma
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <div className={`hidden md:flex items-center gap-2 relative z-10 ${isTransitioning ? 'pointer-events-none opacity-50' : ''}`} onMouseLeave={() => setIsHoveringLink(null)}>
              {navLinks.map((link) => {
                const isActive = activeSection === link.label;
                const isHovered = isHoveringLink === link.label;
                
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href, link.label)}
                    onMouseEnter={() => setIsHoveringLink(link.label)}
                    className="relative px-4 py-2 rounded-full text-[13px] font-medium font-geist tracking-wide transition-colors duration-300 z-10"
                  >
                    <span className={`relative z-10 transition-colors duration-300 ${isActive || isHovered ? "text-white" : "text-white/60"}`}>
                      {link.label}
                    </span>
                    
                    {/* Active Pill Background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-white/10 rounded-full border border-white/5"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    {/* Hover Glow (when not active) */}
                    {isHovered && !isActive && (
                      <motion.div
                        layoutId="hoverNavIndicator"
                        className="absolute inset-0 bg-white/5 rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className={`hidden md:block relative z-10 pr-1 ${isTransitioning ? 'pointer-events-none opacity-50' : ''}`}>
              <Magnetic range={30} strength={0.3}>
                <a
                  href="/#contact"
                  onClick={(e) => handleLinkClick(e, "/#contact", "Contact")}
                  className="group relative px-6 py-2.5 rounded-full text-[12px] font-medium font-geist text-black bg-white flex items-center gap-1.5 shadow-[0_0_0_rgba(255,255,255,0)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.25)] hover:scale-[1.03] transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  <span className="relative z-10 tracking-wide">Start Your Project</span>
                  <ArrowRight size={14} className="relative z-10 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                </a>
              </Magnetic>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => {
                if (!isTransitioning) setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden relative z-50 text-white/80 hover:text-white transition-colors cursor-pointer p-2 rounded-full bg-white/5 border border-white/10"
              aria-label="Toggle mobile menu"
            >
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.div>
            </button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Menu Full Screen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#050505]/95 flex flex-col items-center justify-center pointer-events-auto"
          >
            {/* Ambient Background Glow inside Mobile Menu */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80vw] h-[80vw] bg-accent-purple/10 blur-[100px] rounded-full" />
            </div>

            <div className="flex flex-col items-center gap-8 relative z-10 w-full px-6">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href, link.label)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 + 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`text-3xl font-geist tracking-widest transition-colors duration-300 ${
                    activeSection === link.label ? "text-white" : "text-text-secondary hover:text-white"
                  }`}
                >
                  {link.label}
                </motion.a>
              ))}
              
              <motion.a
                href="/#contact"
                onClick={(e) => handleLinkClick(e, "/#contact", "Contact")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: navLinks.length * 0.05 + 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 px-10 py-4 rounded-full bg-white text-black uppercase tracking-widest text-xs font-geist font-medium shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2 hover:scale-[1.03] transition-transform duration-300"
              >
                Start Your Project <ArrowRight size={16} />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
