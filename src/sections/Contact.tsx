import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Magnetic from "../components/Magnetic";
import { ArrowUpRight, Check, Loader2, CheckCircle2, Shield, Clock, Globe2 } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    projectType: "Business Website",
    budget: "₹25k–₹50k",
    timeline: "2–4 Weeks",
    message: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const projectTypes = ["Business Website", "Landing Page", "E-Commerce Store", "Portfolio", "Custom Web Application", "Website Redesign", "Not Sure Yet"];
  const budgetOptions = ["Under ₹25k", "₹25k–₹50k", "₹50k–₹100k", "₹100k+"];
  const timelineOptions = ["ASAP", "2–4 Weeks", "1–2 Months", "Flexible"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const tempErrors: FormErrors = {};
    if (!form.name.trim()) tempErrors.name = "Name is required";
    if (!form.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = "Please enter a valid email address";
    }
    if (!form.message.trim()) tempErrors.message = "Project Details are required";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "8e2dfb2f-5b39-40f0-a1dd-d203c9a40f07", 
          name: form.name,
          email: form.email,
          company: form.company || "Not provided",
          projectType: form.projectType,
          budget: form.budget,
          timeline: form.timeline,
          message: form.message,
          subject: `New Lead: ${form.projectType} from ${form.name}`,
          from_name: "Vyoma Contact Form"
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus("success");
        setForm({ name: "", email: "", company: "", projectType: "Business Website", budget: "₹25k–₹50k", timeline: "2–4 Weeks", message: "" });
        
        setTimeout(() => {
          setStatus("idle");
        }, 4000);
      } else {
        console.error("Form submission failed:", result);
        setStatus("idle");
        alert("Failed to send message. Please try again or email us directly.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("idle");
      alert("An error occurred. Please try again or email us directly.");
    }
  };

  return (
    <section id="contact" className="relative w-full py-32 bg-transparent px-6 z-10 overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute -left-1/4 top-1/3 pointer-events-none bg-radial-gradient from-accent-purple/10 to-transparent rounded-full blur-[48px] w-[300px] h-[300px] opacity-20 animate-float-blob" style={{ willChange: "transform" }} />
      <div className="absolute right-[-10%] bottom-[-10%] pointer-events-none bg-radial-gradient from-blue-500/5 to-transparent rounded-full blur-[32px] w-48 h-48 opacity-20 animate-pulse" style={{ willChange: "opacity" }} />

      {/* Floating Particles Mock */}
      <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-accent-purple/40 rounded-full blur-[1px] animate-pulse" />
      <div className="absolute bottom-[30%] right-[20%] w-2 h-2 bg-purple-400/30 rounded-full blur-[2px] animate-float-blob" />
      <div className="absolute top-[60%] left-[10%] w-1 h-1 bg-white/20 rounded-full blur-[1px] animate-ping" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-24 text-left">
          <p className="text-xs tracking-[0.3em] uppercase text-accent-purple mb-4 font-geist font-medium">
            Initiate
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold font-geist text-white tracking-wide leading-tight">
            Let's Build Something <br className="hidden md:block" />Exceptional.
          </h2>
          <p className="text-sm md:text-base text-text-secondary mt-6 max-w-xl font-light tracking-wide leading-relaxed">
            Tell us about your business, goals, or idea. We'll review your requirements, recommend the best solution, and get back to you within one business day.
          </p>
        </div>

        {/* Contact Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Info Side (5 cols) */}
          <div className="lg:col-span-5 flex flex-col text-left space-y-16 select-none">
            
            {/* Why Choose Block */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <Shield size={16} className="text-accent-purple" />
                <span className="text-xs font-mono tracking-[0.2em] text-white uppercase font-medium">
                  Why Choose Vyoma.Webx
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Fully Custom Websites",
                  "Mobile-First Development",
                  "SEO Optimized",
                  "Fast Loading",
                  "Secure & Scalable",
                  "Premium UI/UX"
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5">
                    <CheckCircle2 size={12} className="text-accent-purple" />
                    <span className="text-xs md:text-sm font-light text-text-secondary tracking-wide">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Block */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <Clock size={16} className="text-accent-purple" />
                <span className="text-xs font-mono tracking-[0.2em] text-white uppercase font-medium">
                  Project Timeline
                </span>
              </div>
              <div className="flex flex-col gap-5 relative before:absolute before:inset-y-2 before:left-[5px] before:w-[1px] before:bg-white/10">
                {["Discovery", "Design", "Development", "Launch"].map((step, idx) => (
                  <div key={step} className="flex items-center gap-4 relative">
                    <div className="w-3 h-3 rounded-full bg-[#050505] border-2 border-accent-purple/50 z-10 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-accent-purple" />
                    </div>
                    <span className="text-xs font-geist text-text-secondary tracking-wider uppercase">
                      <span className="text-white/20 mr-2">0{idx + 1}</span>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Time & Location */}
            <div className="space-y-8 glass-card p-6 md:p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-[0.2em] text-text-secondary/60 uppercase">
                  Response Time
                </span>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium font-geist text-white tracking-wide">
                    Usually within 24 hours
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-[0.2em] text-text-secondary/60 uppercase flex items-center gap-2">
                  <Globe2 size={12} /> Serving Clients Worldwide
                </span>
                <p className="text-sm font-light text-text-secondary leading-relaxed">
                  Remote-first studio based in India.
                </p>
              </div>
            </div>
            
          </div>

          {/* Form Side (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-12 text-left z-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Input Name */}
              <div className="relative group">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-0 py-3 bg-transparent border-b border-white/10 text-white text-sm font-light tracking-wide placeholder-transparent focus:outline-none focus:border-accent-purple transition-all duration-300 rounded-none peer"
                  placeholder="Name"
                  id="form-name"
                />
                <label 
                  htmlFor="form-name"
                  className={`absolute left-0 top-3 text-xs text-text-secondary/60 tracking-wider pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-[9px] peer-focus:text-accent-purple peer-focus:font-mono ${
                    form.name ? "-top-3 text-[9px] text-accent-purple font-mono" : ""
                  }`}
                >
                  FULL NAME
                </label>
                <AnimatePresence>
                  {errors.name && (
                    <motion.span 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -5 }}
                      className="text-[10px] text-red-400 mt-2 block tracking-wider uppercase font-mono absolute -bottom-5"
                    >
                      {errors.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* Animated bottom border */}
                <div className={`absolute bottom-0 left-0 h-[1px] transition-all duration-500 ease-out ${errors.name ? 'bg-red-500/50 w-full' : 'bg-accent-purple w-0 peer-focus:w-full'}`} />
              </div>

              {/* Input Email */}
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-0 py-3 bg-transparent border-b border-white/10 text-white text-sm font-light tracking-wide placeholder-transparent focus:outline-none focus:border-accent-purple transition-all duration-300 rounded-none peer"
                  placeholder="Email"
                  id="form-email"
                />
                <label 
                  htmlFor="form-email"
                  className={`absolute left-0 top-3 text-xs text-text-secondary/60 tracking-wider pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-[9px] peer-focus:text-accent-purple peer-focus:font-mono ${
                    form.email ? "-top-3 text-[9px] text-accent-purple font-mono" : ""
                  }`}
                >
                  BUSINESS EMAIL
                </label>
                <AnimatePresence>
                  {errors.email && (
                    <motion.span 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -5 }}
                      className="text-[10px] text-red-400 mt-2 block tracking-wider uppercase font-mono absolute -bottom-5"
                    >
                      {errors.email}
                    </motion.span>
                  )}
                </AnimatePresence>
                <div className={`absolute bottom-0 left-0 h-[1px] transition-all duration-500 ease-out ${errors.email ? 'bg-red-500/50 w-full' : 'bg-accent-purple w-0 peer-focus:w-full'}`} />
              </div>
            </div>

            {/* Input Company (Optional) */}
            <div className="relative group">
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full px-0 py-3 bg-transparent border-b border-white/10 text-white text-sm font-light tracking-wide placeholder-transparent focus:outline-none focus:border-accent-purple transition-all duration-300 rounded-none peer"
                placeholder="Company Name (Optional)"
                id="form-company"
              />
              <label 
                htmlFor="form-company"
                className={`absolute left-0 top-3 text-xs text-text-secondary/60 tracking-wider pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-[9px] peer-focus:text-accent-purple peer-focus:font-mono ${
                  form.company ? "-top-3 text-[9px] text-accent-purple font-mono" : ""
                }`}
              >
                COMPANY NAME (OPTIONAL)
              </label>
              <div className="absolute bottom-0 left-0 h-[1px] bg-accent-purple w-0 peer-focus:w-full transition-all duration-500 ease-out" />
            </div>

            {/* Project Types Selection */}
            <div className="space-y-4">
              <span className="text-[9px] font-mono tracking-[0.2em] text-text-secondary/60 uppercase">
                Project Type
              </span>
              <div className="flex flex-wrap gap-2.5">
                {projectTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, projectType: type }))}
                    className={`px-4 py-2 rounded-lg text-[11px] font-geist tracking-wide border transition-all duration-300 cursor-pointer ${
                      form.projectType === type 
                        ? "border-accent-purple bg-accent-purple/10 text-white shadow-[0_0_15px_rgba(192,132,252,0.15)]" 
                        : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 text-text-secondary hover:text-white/80"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget & Timeline Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Budget Selection */}
              <div className="space-y-4">
                <span className="text-[9px] font-mono tracking-[0.2em] text-text-secondary/60 uppercase">
                  Budget Range
                </span>
                <div className="flex flex-wrap gap-2">
                  {budgetOptions.map(budget => (
                    <button
                      key={budget}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, budget: budget }))}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-geist tracking-wide border transition-all duration-300 cursor-pointer ${
                        form.budget === budget 
                          ? "border-accent-purple bg-accent-purple/10 text-white shadow-[0_0_15px_rgba(192,132,252,0.15)]" 
                          : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 text-text-secondary hover:text-white/80"
                      }`}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline Selection */}
              <div className="space-y-4">
                <span className="text-[9px] font-mono tracking-[0.2em] text-text-secondary/60 uppercase">
                  Expected Timeline
                </span>
                <div className="flex flex-wrap gap-2">
                  {timelineOptions.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, timeline: time }))}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-geist tracking-wide border transition-all duration-300 cursor-pointer ${
                        form.timeline === time 
                          ? "border-accent-purple bg-accent-purple/10 text-white shadow-[0_0_15px_rgba(192,132,252,0.15)]" 
                          : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 text-text-secondary hover:text-white/80"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="relative group">
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-0 py-3 bg-transparent border-b border-white/10 text-white text-sm font-light tracking-wide placeholder-transparent focus:outline-none focus:border-accent-purple transition-all duration-300 rounded-none resize-none peer"
                placeholder="Project Details"
                id="form-message"
              />
              <label 
                htmlFor="form-message"
                className={`absolute left-0 top-3 text-xs text-text-secondary/60 tracking-wider pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-[9px] peer-focus:text-accent-purple peer-focus:font-mono ${
                  form.message ? "-top-3 text-[9px] text-accent-purple font-mono" : ""
                }`}
              >
                PROJECT DETAILS
              </label>
              <AnimatePresence>
                {errors.message && (
                  <motion.span 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[10px] text-red-400 mt-2 block tracking-wider uppercase font-mono absolute -bottom-4"
                  >
                    {errors.message}
                  </motion.span>
                )}
              </AnimatePresence>
              <div className={`absolute bottom-1 left-0 h-[1px] transition-all duration-500 ease-out ${errors.message ? 'bg-red-500/50 w-full' : 'bg-accent-purple w-0 peer-focus:w-full'}`} />
            </div>

            {/* Submit Button & Trust Indicators */}
            <div className="pt-4 flex flex-col space-y-6">
              <Magnetic range={30} strength={0.3}>
                <button
                  type="submit"
                  disabled={status === "submitting" || status === "success"}
                  className="w-full md:w-max relative px-12 py-5 rounded-full text-xs font-geist uppercase tracking-[0.15em] font-medium text-white transition-all duration-500 flex items-center justify-center gap-3 cursor-pointer border border-accent-purple/40 bg-accent-purple/10 hover:bg-accent-purple/20 shadow-[0_0_20px_rgba(192,132,252,0.1)] hover:shadow-[0_0_30px_rgba(192,132,252,0.25)] overflow-hidden group"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  
                  <AnimatePresence mode="wait">
                    {status === "idle" && (
                      <motion.div 
                        key="idle" 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        Start Your Project <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </motion.div>
                    )}
                    {status === "submitting" && (
                      <motion.div 
                        key="loading" 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2 text-accent-purple"
                      >
                        Sending <Loader2 size={16} className="animate-spin" />
                      </motion.div>
                    )}
                    {status === "success" && (
                      <motion.div 
                        key="success" 
                        initial={{ opacity: 0, scale: 0.8 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-green-400 font-medium"
                      >
                        Request Received <Check size={16} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </Magnetic>

              {/* Trust Bar below button */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-white/5">
                {[
                  "Free Consultation",
                  "Response Within 24 Hours",
                  "No Spam Ever",
                  "SSL Secured"
                ].map((indicator) => (
                  <div key={indicator} className="flex items-center gap-1.5">
                    <CheckCircle2 size={10} className="text-text-secondary/50" />
                    <span className="text-[10px] font-geist tracking-wide text-text-secondary/70 uppercase">
                      {indicator}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </form>

        </div>
      </div>
    </section>
  );
}
