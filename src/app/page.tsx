import AttractivePlacesCarousel from "@/components/AttractivePlacesCaousel";
import { HeroSection } from "@/components/hero";
import VisitCountrySection from "@/components/visitContry";



export default function HomePage() {
  return (
    <main
      // className="flex min-h-screen flex-col items-center justify-between p-24"
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex"></div>
      <HeroSection
        videoSrc='/videos/vid.mp4'
        title="Explorez le Congo Merveilleux"
        subtitle="Découvrez des paysages à couper le souffle, une culture vibrante et des aventures inoubliables."
        ctaText="Commencer l'aventure"
        ctaLink="/logements"
        showPlayButton={true}
      />
      <VisitCountrySection />
      <AttractivePlacesCarousel />
    </main>
  );
}