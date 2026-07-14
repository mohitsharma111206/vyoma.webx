import { useEffect, useState, useCallback } from "react";
import { ArrowUp, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import Magnetic from "../components/Magnetic";
import { useTransition } from "../context/TransitionContext";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Services", href: "/#services" },
  { label: "Workflow", href: "/workflow" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/#contact" }
];

const serviceLinks = [
  { label: "Business Websites", href: "/#services" },
  { label: "Web Applications", href: "/#services" },
  { label: "E-Commerce", href: "/#services" },
  { label: "UI/UX Design", href: "/#services" },
  { label: "SEO Optimization", href: "/#services" }
];

const socialLinks = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/vyoma.webx/",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/917737348016",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    )
  },
  {
    name: "Email",
    url: "mailto:vyoma.webx@gmail.com",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4.25l-8 4.99-8-4.99V6l8 5 8-5v2.25z"/>
      </svg>
    )
  }
];

export default function Footer() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const { navigateWithTransition, isTransitioning } = useTransition();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPx = document.documentElement.scrollTop;
          const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrolled = winHeightPx > 0 ? (scrollPx / winHeightPx) * 100 : 0;
          setScrollProgress(scrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTop = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (isTransitioning) return;
    
    if (location.pathname !== "/") {
      navigateWithTransition("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isTransitioning, location.pathname, navigateWithTransition]);

  const handleLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (isTransitioning) return;
    navigateWithTransition(href);
  }, [isTransitioning, navigateWithTransition]);

  return (
    <footer className="relative w-full bg-[#030303] z-10 select-none overflow-hidden">
      
      {/* Animated Gradient Divider */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-purple/50 to-transparent opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[100px] bg-accent-purple/10 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        
        {/* Top Section: CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-20 border-b border-white/5">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-geist font-bold tracking-tight text-white mb-4">
              Ready to Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-white">Exceptional?</span>
            </h2>
            <p className="text-text-secondary font-light tracking-wide max-w-md">
              Let's discuss how we can engineer a high-performing digital product for your ambitious brand.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Magnetic range={20} strength={0.2}>
              <a 
                href="/#contact"
                onClick={(e) => handleLinkClick(e, "/#contact")}
                className={`group relative px-8 py-4 rounded-full bg-white text-black font-geist text-sm font-medium tracking-wide flex items-center justify-center gap-2 overflow-hidden transition-transform duration-300 ${isTransitioning ? 'pointer-events-none opacity-50' : 'hover:scale-105'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span className="relative z-10">Start Your Project</span>
              </a>
            </Magnetic>
            <a 
              href="/#contact"
              onClick={(e) => handleLinkClick(e, "/#contact")}
              className={`group px-8 py-4 rounded-full bg-transparent border border-white/10 text-white font-geist text-sm font-medium tracking-wide flex items-center justify-center gap-2 transition-all duration-300 ${isTransitioning ? 'pointer-events-none opacity-50' : 'hover:bg-white/5 hover:border-white/20'}`}
            >
              Schedule a Free Consultation 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>

        {/* Middle Section: Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 py-20 border-b border-white/5">
          
          {/* Col 1: Brand */}
          <div className="flex flex-col space-y-6">
            <a href="/#home" onClick={(e) => handleLinkClick(e, "/#home")} className={`text-2xl font-bold tracking-widest text-white font-geist flex items-center gap-2 ${isTransitioning ? 'pointer-events-none' : ''}`}>
              Vyoma
            </a>
            <div className="space-y-4">
              <p className="text-sm text-white/90 font-medium tracking-wide">
                Crafting Digital Experiences That Drive Growth.
              </p>
              <p className="text-sm text-text-secondary/70 font-light leading-relaxed">
                From business websites to custom web applications, we help ambitious brands build fast, beautiful, and scalable digital products.
              </p>
            </div>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map((social) => (
                <div key={social.name} className="relative group">
                  <Magnetic range={20} strength={0.3}>
                    <a 
                      href={social.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 hover:border-accent-purple/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] relative z-10"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  </Magnetic>
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none">
                    <div className="px-3 py-1.5 bg-[#111] border border-white/10 rounded-md text-[10px] font-geist tracking-widest uppercase text-white shadow-xl whitespace-nowrap">
                      {social.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="flex flex-col space-y-6">
            <h4 className="text-xs font-mono tracking-widest uppercase text-white/40">Navigation</h4>
            <ul className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`text-sm text-text-secondary font-geist tracking-wide transition-colors duration-300 flex items-center group w-fit ${isTransitioning ? 'pointer-events-none opacity-50' : 'hover:text-white cursor-pointer'}`}
                  >
                    <span className="w-0 h-[1px] bg-accent-purple mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="flex flex-col space-y-6">
            <h4 className="text-xs font-mono tracking-widest uppercase text-white/40">Services</h4>
            <ul className="flex flex-col space-y-4">
              {serviceLinks.map((service) => (
                <li key={service.label}>
                  <a 
                    href={service.href}
                    onClick={(e) => handleLinkClick(e, service.href)}
                    className={`text-sm text-text-secondary font-geist tracking-wide transition-colors duration-300 flex items-center group w-fit ${isTransitioning ? 'pointer-events-none opacity-50' : 'hover:text-white cursor-pointer'}`}
                  >
                    <span className="w-0 h-[1px] bg-accent-purple mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300" />
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="flex flex-col space-y-6">
            <h4 className="text-xs font-mono tracking-widest uppercase text-white/40">Contact</h4>
            <ul className="flex flex-col space-y-4">
              <li>
                <a href="mailto:vyoma.webx@gmail.com" className="text-sm text-white font-medium hover:text-accent-purple font-geist tracking-wide transition-colors duration-300 inline-block">
                  vyoma.webx@gmail.com
                </a>
              </li>
              <li className="text-sm text-text-secondary font-light font-geist tracking-wide">
                Based in India
              </li>
              <li className="text-sm text-text-secondary font-light font-geist tracking-wide">
                Serving Clients Worldwide
              </li>
              <li className="text-sm text-accent-purple/80 font-medium font-geist tracking-wide flex items-center gap-2 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
                Response Within 24 Hours
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright & Scroll to Top */}
        <div className="pt-8 flex flex-col-reverse md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p className="text-xs text-text-secondary/50 font-geist tracking-wide">
              &copy; {new Date().getFullYear()} Vyoma. All rights reserved.
            </p>
            <p className="text-xs text-text-secondary/50 font-geist tracking-wide flex items-center gap-1.5">
              Crafted with precision by Vyoma.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-text-secondary/50 font-geist tracking-wide">
            <a href="#privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors duration-300">Terms & Conditions</a>
          </div>

          <Magnetic range={25} strength={0.3}>
            <a 
              href="/#home"
              onClick={handleScrollTop}
              className={`relative w-14 h-14 rounded-full bg-[#111] border border-white/10 flex items-center justify-center group transition-colors duration-300 ${isTransitioning ? 'pointer-events-none opacity-50' : 'hover:bg-white/5 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] cursor-pointer'}`}
              aria-label="Scroll to top"
            >
              {/* Circular Progress SVG */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="48" 
                  fill="transparent" 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="2" 
                />
                <circle 
                  cx="50" cy="50" r="48" 
                  fill="transparent" 
                  stroke="#a855f7" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  strokeDasharray="301.59"
                  strokeDashoffset={301.59 - (301.59 * scrollProgress) / 100}
                  className="transition-all duration-150 ease-out"
                />
              </svg>
              <ArrowUp size={18} className={`text-text-secondary transition-all duration-300 ${isTransitioning ? '' : 'group-hover:text-white group-hover:-translate-y-1'}`} />
            </a>
          </Magnetic>
        </div>

      </div>
    </footer>
  );
}
