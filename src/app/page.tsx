// "use client"

import AttractivePlacesCarousel from "@/components/AttractivePlacesCaousel";
import { BriefIntroductionSection } from "@/components/BriefIntroductionSection";
import { CallToActionSection } from "@/components/CallToActionSection";
import { ExperiencesHighlightSection } from "@/components/ExperiencesHighlightSection";
import { FaqAccordionSection } from "@/components/FaqAccordionSection";
import { HeroSection } from "@/components/hero";
import { KeyFiguresSection } from "@/components/KeyFiguresSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import VisitCountrySection from "@/components/visitContry";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection
        videoSrc='/videos/vid.mp4'
        title="Explorez le Congo Merveilleux"
        subtitle="Découvrez des paysages à couper le souffle, une culture vibrante et des aventures inoubliables."
        ctaText="Commencer l'aventure"
        ctaLink="/logements"
        showPlayButton={true}
      />
      <BriefIntroductionSection />
      <VisitCountrySection />
      <KeyFiguresSection />
      {/* <AttractivePlacesCarousel /> */}
      <ExperiencesHighlightSection />
      <AboutSection />
      {/* <TestimonialsSection /> */}
      <ContactSection />
      <FaqAccordionSection />
      <CallToActionSection />
    </main>
  );
}