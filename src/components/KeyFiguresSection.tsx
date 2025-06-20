"use client";

import { Landmark, Trees, Users, ShieldCheck } from "lucide-react";

const figures = [
    { icon: Trees, value: "+10", label: "Parcs Nationaux & Réserves", description: "Protégeant une biodiversité unique." },
    { icon: Landmark, value: "5", label: "Sites UNESCO", description: "Trésors du patrimoine mondial." },
    { icon: Users, value: "+450", label: "Groupes Ethniques", description: "Une mosaïque culturelle vibrante." },
    { icon: ShieldCheck, value: "N°2", label: "Forêt Tropicale Mondiale", description: "Poumon vital de la planète." },
];

export function KeyFiguresSection() {
    return (
        <section className="py-16 sm:py-20 bg-muted/30" data-aos="fade-in" data-aos-duration="1000">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-foreground" data-aos="fade-up">
                    La RDC en Chiffres Éloquents
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {figures.map((figure, index) => (
                        <div
                            key={index}
                            className="bg-card p-6 rounded-xl shadow-lg text-center flex flex-col items-center"
                            data-aos="zoom-in-up"
                            data-aos-delay={100 + index * 150}
                            data-aos-duration="800"
                        >
                            <figure.icon className="h-12 w-12 text-primary mb-4" />
                            <div className="text-4xl font-extrabold text-foreground mb-1">{figure.value}</div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{figure.label}</h3>
                            <p className="text-sm text-muted-foreground">{figure.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}