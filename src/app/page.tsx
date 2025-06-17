import { HeroSection } from "@/components/hero";



export default function HomePage() {
  return (
    <main
      // className="flex min-h-screen flex-col items-center justify-between p-24"
    >
      {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex"></div> */}
      <HeroSection
        videoSrc='/videos/vid.mp4' // Assurez-vous que ce chemin est correct depuis public/
        title="Explorez le Congo Merveilleux"
        subtitle="Découvrez des paysages à couper le souffle, une culture vibrante et des aventures inoubliables."
        ctaText="Commencer l'aventure"
        ctaLink="/logements"
        showPlayButton={true}
      />
    </main>
  );
}