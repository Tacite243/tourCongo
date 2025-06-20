"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle } from "lucide-react";

export function ContactSection() {
    return (
        <section className="py-16 sm:py-24 bg-muted/30" data-aos="fade-up" data-aos-duration="1000">
            <div className="container mx-auto px-4 text-center">
                <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-6">
                    Prêt à Discuter de Votre Aventure ?
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    Notre équipe d'experts est à votre écoute pour répondre à toutes vos questions, vous aider à planifier
                    votre voyage sur mesure ou explorer des opportunités de partenariat.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/contact" data-aos="zoom-in-right" data-aos-delay="200">
                        <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-7 rounded-full shadow-lg">
                            <MessageCircle className="mr-3 h-5 w-5" /> Envoyez-nous un Message
                        </Button>
                    </Link>
                    <a href="tel:+243XXXXXXXXX" data-aos="zoom-in-left" data-aos-delay="300"> {/* Remplacez par votre numéro */}
                        <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-7 rounded-full border-2">
                            <Phone className="mr-3 h-5 w-5" /> Appelez-nous Directement
                        </Button>
                    </a>
                </div>
            </div>
        </section>
    );
}