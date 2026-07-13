import Hero from "../sections/Hero";
import Services from "../sections/Services";
import Process from "../sections/Process";
import TechStack from "../sections/TechStack";
import Testimonials from "../sections/Testimonials";
import FAQCTA from "../sections/FAQCTA";
import Contact from "../sections/Contact";

interface HomeProps {
  setLoadProgress: (progress: number) => void;
  setIsLoaded: (isLoaded: boolean) => void;
  preloaderComplete: boolean;
}

export default function Home({ setLoadProgress, setIsLoaded, preloaderComplete }: HomeProps) {
  return (
    <>
      <Hero 
        setLoadProgress={setLoadProgress} 
        setIsLoaded={setIsLoaded} 
        preloaderComplete={preloaderComplete}
      />
      <Services />
      <Testimonials />
      <FAQCTA />
      <Contact />
    </>
  );
}
