"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mountain, Users2, Waves } from "lucide-react";

const experiences = [
    {
        title: "Aventure Indomptée",
        description: "Trekking sur des volcans actifs, safaris à la rencontre des grands animaux, rafting sur des rapides tumultueux.",
        imageUrl: "/baner-right-image-03.jpg",
        link: "/aventures",
        aos: "fade-right",
        icon: Mountain,
    },
    {
        title: "Immersion Culturelle Profonde",
        description: "Participez à des festivals colorés, rencontrez des communautés locales chaleureuses et découvrez un artisanat ancestral.",
        imageUrl: "/images/experience-culture.jpg", // Image culturelle
        link: "/culture",
        aos: "fade-up",
        icon: Users2,
    },
    {
        title: "Évasion Sereine",
        description: "Détendez-vous dans des lodges éco-responsables nichés dans une nature luxuriante, au bord de lacs paisibles.",
        imageUrl: "/images/experience-serenite.jpg", // Image de détente
        link: "/serenite",
        aos: "fade-left",
        icon: Waves,
    },
];

export function ExperiencesHighlightSection() {
    return (
        <section className="py-16 sm:py-24 bg-background" data-aos="fade-in" data-aos-duration="1000">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight" data-aos="fade-up">
                        Vivez des Moments Inoubliables
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
                        Que vous soyez en quête d'adrénaline, de découvertes culturelles ou de tranquillité, la RDC a une expérience unique à vous offrir.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {experiences.map((exp, index) => (
                        <div
                            key={exp.title}
                            className="group relative rounded-xl overflow-hidden shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-primary/30"
                            data-aos={exp.aos}
                            data-aos-delay={150 * index}
                            data-aos-duration="900"
                        >
                            <Image
                                src={exp.imageUrl}
                                alt={exp.title}
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-700 ease-in-out group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6">
                                <exp.icon className="h-10 w-10 text-white/80 mb-3 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                                <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                                <p className="text-sm text-gray-200 mb-4 line-clamp-3">{exp.description}</p>
                                <Link href={exp.link} className="mt-auto">
                                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30">
                                        En savoir plus
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}