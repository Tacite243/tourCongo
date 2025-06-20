"use client";


import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Compass, Users } from "lucide-react";

export function AboutSection() {
    return (
        <section className="py-16 sm:py-24 bg-background" data-aos="fade-up" data-aos-duration="1000">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div data-aos="fade-right" data-aos-delay="200" data-aos-duration="1000">
                        <div className="mb-6">
                            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Notre Mission</span>
                            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                                Révéler la Beauté Authentique de la RDC
                            </h2>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                            Chez Tour Congo, nous sommes passionnés par la richesse culturelle, la biodiversité unique et le potentiel
                            inexploré de la République Démocratique du Congo. Notre mission est de vous offrir des expériences de voyage
                            immersives et responsables, tout en promouvant un tourisme qui bénéficie aux communautés locales et préserve
                            le patrimoine exceptionnel de ce pays magnifique.
                        </p>
                        <div className="space-y-4 mb-8">
                            <div className="flex items-start" data-aos="fade-up" data-aos-delay="300">
                                <Heart className="h-7 w-7 text-primary mr-4 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-foreground text-lg">Voyages avec Cœur</h4>
                                    <p className="text-muted-foreground text-sm">Des circuits conçus avec passion pour une découverte profonde et respectueuse.</p>
                                </div>
                            </div>
                            <div className="flex items-start" data-aos="fade-up" data-aos-delay="400">
                                <Compass className="h-7 w-7 text-primary mr-4 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-foreground text-lg">Exploration Guidée</h4>
                                    <p className="text-muted-foreground text-sm">Accompagnement par des experts locaux pour une aventure sécurisée et enrichissante.</p>
                                </div>
                            </div>
                            <div className="flex items-start" data-aos="fade-up" data-aos-delay="500">
                                <Users className="h-7 w-7 text-primary mr-4 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-foreground text-lg">Impact Positif</h4>
                                    <p className="text-muted-foreground text-sm">Engagement envers un tourisme durable qui soutient les initiatives locales.</p>
                                </div>
                            </div>
                        </div>
                        <Link href="/a-propos">
                            <Button size="lg" className="rounded-full">En savoir plus sur nous</Button>
                        </Link>
                    </div>
                    <div className="relative w-full aspect-square sm:aspect-video lg:aspect-[4/5] rounded-xl overflow-hidden shadow-2xl order-first lg:order-last" data-aos="fade-left" data-aos-delay="300" data-aos-duration="1000">
                        <Image
                            src="/images/baner-right-image-03.jpg" // Image représentative de votre mission ou de l'équipe
                            alt="L'équipe Tour Congo ou un paysage inspirant de la RDC"
                            layout="fill"
                            objectFit="cover"
                            quality={80}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}