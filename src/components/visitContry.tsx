// src/components/VisitCountrySection.tsx
"use client";

import { Separator } from "@/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown, ExternalLink, MapPin, Coffee, TrendingUp } from "lucide-react"; // Ajout d'icônes thématiques
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button"; // Assurez-vous que le chemin est correct

export default function VisitCountrySection() {
    return (
        <section className="py-16 sm:py-24 lg:py-32 bg-background text-foreground overflow-x-hidden">
            <div className="container mx-auto px-4"> {/* Container pour centrer le contenu */}
                <div className="text-center mb-12 sm:mb-16" data-aos="fade-up">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                        Découvrez la RDC
                    </h1>
                    <Separator className="mx-auto mt-4 w-20 bg-primary h-1.5 rounded-full" />
                </div>

                {/* Grille principale pour image et contenu */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Colonne de l'Image */}
                    <div className="relative w-full h-80 sm:h-96 md:h-[500px] lg:h-full rounded-xl overflow-hidden shadow-2xl" data-aos="fade-right" data-aos-duration="1000">
                        <Image
                            src="/anapi.jpeg" // Remplacez par une image plus verticale ou adaptée à ce format
                            alt="Paysage époustouflant de la République Démocratique du Congo"
                            layout="fill"
                            objectFit="cover"
                            className="transform group-hover:scale-105 transition-transform duration-500 ease-in-out" // Effet de zoom léger au survol (si parent a group)
                            quality={80}
                            priority // Si cette section est haute dans la page
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div> {/* Overlay subtil pour le contraste */}
                        <div className="absolute bottom-6 left-6 p-4">
                            <h3 className="text-2xl sm:text-3xl font-bold text-white shadow-sm">Virunga, Terre de Géants</h3>
                            <p className="text-sm sm:text-base text-gray-200 mt-1">Explorez les volcans et les gorilles de montagne.</p>
                        </div>
                    </div>

                    {/* Colonne du Contenu (Texte et Accordéon) */}
                    <div className="flex flex-col justify-center" data-aos="fade-left" data-aos-delay="200" data-aos-duration="1000">
                        <div className="space-y-5 text-lg text-muted-foreground mb-8">
                            <p>
                                La République Démocratique du Congo, un joyau brut au cœur de l'Afrique, vous invite à une aventure sans pareille.
                                Un pays de contrastes saisissants, où la nature exubérante côtoie une culture vibrante et une histoire profonde.
                            </p>
                            <p>
                                Des sommets volcaniques des Virunga aux vastes étendues du bassin du fleuve Congo, chaque région raconte une histoire unique,
                                attendant d'être découverte par les voyageurs audacieux et les investisseurs visionnaires.
                            </p>
                        </div>

                        {/* Accordéon pour les détails supplémentaires */}
                        <Accordion type="single" collapsible className="w-full bg-card p-0.5 rounded-xl shadow-lg border">
                            <AccordionItem value="item-1" className="border-b">
                                <AccordionTrigger className="group text-base sm:text-lg font-semibold py-4 px-5 hover:no-underline data-[state=open]:text-primary">
                                    <div className="flex items-center">
                                        <MapPin className="h-5 w-5 mr-3 text-primary/80 group-data-[state=open]:text-primary transition-colors" />
                                        <span>Tourisme et Aventure</span>
                                    </div>
                                    <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                                </AccordionTrigger>
                                <AccordionContent className="pt-1 pb-4 px-5 text-sm sm:text-base text-muted-foreground space-y-3">
                                    <p>
                                        Parcs nationaux riches en biodiversité, volcans actifs, chutes majestueuses et une faune unique au monde.
                                        La RDC est une destination de choix pour l'écotourisme et les expériences authentiques.
                                    </p>
                                    <Link href="/circuits-touristiques">
                                        <Button variant="link" className="p-0 h-auto text-primary">Découvrir nos circuits <ExternalLink className="ml-1 h-4 w-4" /></Button>
                                    </Link>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2" className="border-b-0"> {/* Pas de bordure pour le dernier item s'il est dans un conteneur 'bg-card' */}
                                <AccordionTrigger className="group text-base sm:text-lg font-semibold py-4 px-5 hover:no-underline data-[state=open]:text-primary">
                                    <div className="flex items-center">
                                         <TrendingUp className="h-5 w-5 mr-3 text-primary/80 group-data-[state=open]:text-primary transition-colors" />
                                        <span>Opportunités d'Investissement</span>
                                    </div>
                                    <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                                </AccordionTrigger>
                                <AccordionContent className="pt-1 pb-4 px-5 text-sm sm:text-base text-muted-foreground space-y-3">
                                    <p>
                                        Avec ses vastes ressources naturelles, une population jeune et un marché en croissance, la RDC offre
                                        un potentiel d'investissement considérable dans l'agriculture, les énergies renouvelables, les infrastructures et le tourisme.
                                    </p>
                                    <a href="#" target="_blank" rel="noopener noreferrer">
                                        <Button variant="link" className="p-0 h-auto text-primary">Explorer les secteurs porteurs <ExternalLink className="ml-1 h-4 w-4" /></Button>
                                    </a>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className="mt-10 text-center lg:text-left">
                            <Link href="/planifier-voyage">
                                <Button size="lg" className="rounded-full shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105">
                                    Commencez Votre Aventure Congolaise
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}