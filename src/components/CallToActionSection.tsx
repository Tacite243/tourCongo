"use client";


import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CallToActionSection() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden" data-aos="zoom-in" data-aos-duration="1000">
      {/* Image de fond avec effet de parallaxe simulé (ajustez le chemin de l'image) */}
      <div className="absolute inset-0 z-[-1]">
        <Image
          src="/images/cta-background.jpg" // Image de fond inspirante (ex: un beau paysage congolais)
          alt="Paysage congolais invitant à l'aventure"
          layout="fill"
          objectFit="cover"
          quality={85}
          className="opacity-30 dark:opacity-20" // Ajustez l'opacité
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <Sparkles className="h-16 w-16 text-primary mx-auto mb-6 opacity-80" data-aos="zoom-in" data-aos-delay="200"/>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6" data-aos="fade-up" data-aos-delay="300">
          Votre Aventure Congolaise <br className="hidden sm:block" /> Commence Maintenant
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed" data-aos="fade-up" data-aos-delay="400">
          N'attendez plus pour découvrir les trésors cachés et la culture vibrante de la RDC.
          Des expériences uniques et des souvenirs inoubliables vous attendent.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4" data-aos="fade-up" data-aos-delay="500">
          <Link href="/logements">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-7 rounded-full shadow-lg transform transition-all hover:scale-105 hover:shadow-primary/40">
              Explorer nos Logements
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-7 rounded-full border-2 hover:bg-primary/10 hover:border-primary transform transition-all hover:scale-105">
              Contacter un Expert <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}