// src/components/Footer.tsx
"use client";

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Send } from 'lucide-react'; // Ou X
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const navLinks = [
    { href: '/logements', label: 'Logements' },
    { href: '/experiences', label: 'Expériences' },
    { href: '/services', label: 'Services' },
    { href: '/a-propos', label: 'À Propos' },
    { href: '/contact', label: 'Contact' },
    { href: '/faq', label: 'FAQ' },
];

const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Twitter, label: 'Twitter / X' }, // Ou X si vous avez cette icône
    { href: '#', icon: Linkedin, label: 'LinkedIn' },
    { href: '#', icon: Youtube, label: 'YouTube' },
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-10">
                    {/* Logo et description */}
                    <div className="space-y-4 md:col-span-2 lg:col-span-1" data-aos="fade-up">
                        <Link href="/" className="flex items-center space-x-2">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Logo Tour Congo">
                                <path d="M29.8665 10.3511C29.9465 9.54311 29.4025 8.79811 28.6115 8.51411C27.8205 8.23111 26.9335 8.47711 26.4705 9.11311L24.0005 12.7331V4.93411C24.0005 4.24911 23.4135 3.69411 22.6875 3.69411C21.9615 3.69411 21.3755 4.24911 21.3755 4.93411V10.5481L17.6165 4.66711C17.1485 3.92811 16.2435 3.61411 15.4085 3.81711C14.5745 4.02011 13.9545 4.71311 13.9235 5.55311L13.6965 11.0871L10.6245 5.01011C10.1735 4.14511 9.25051 3.74211 8.34351 3.95711C7.43651 4.17311 6.80051 4.94411 6.75751 5.84411L6.30251 15.6441L3.53151 10.1611C3.07451 9.27211 2.15851 8.87011 1.25851 9.10211C0.357511 9.33311 -0.156489 10.1381 0.0335114 11.0371C0.223511 11.9371 0.969511 12.5841 1.84251 12.6351L1.90251 12.6381L5.12551 28.0001H5.15251C5.48851 28.0001 5.80051 27.7941 5.93451 27.4881L10.1165 17.8911L12.9385 27.4881C13.0725 27.7941 13.3855 28.0001 13.7205 28.0001H13.7475L17.1525 16.0351L19.8255 27.4881C19.9595 27.7941 20.2725 28.0001 20.6075 28.0001H20.6345L26.0985 10.6991C26.0995 10.6961 26.1005 10.6941 26.1025 10.6911L29.8665 10.3511Z" fill="#FF5A5F" />
                            </svg>
                            <span className="font-bold text-xl text-[#FF5A5F]">Tour Congo</span>
                        </Link>
                        <p className="text-sm">
                            Votre porte d'entrée vers les merveilles de la République Démocratique du Congo.
                            Explorez, découvrez, investissez.
                        </p>
                    </div>

                    {/* Liens de navigation */}
                    <div data-aos="fade-up" data-aos-delay="100">
                        <h5 className="font-semibold text-slate-200 mb-3">Navigation</h5>
                        <ul className="space-y-2">
                            {navLinks.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="hover:text-primary transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Liens utiles / Légal */}
                    <div data-aos="fade-up" data-aos-delay="200">
                        <h5 className="font-semibold text-slate-200 mb-3">Légal</h5>
                        <ul className="space-y-2">
                            <li><Link href="/mentions-legales" className="hover:text-primary transition-colors text-sm">Mentions Légales</Link></li>
                            <li><Link href="/politique-confidentialite" className="hover:text-primary transition-colors text-sm">Confidentialité</Link></li>
                            <li><Link href="/cgv" className="hover:text-primary transition-colors text-sm">Conditions Générales</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div data-aos="fade-up" data-aos-delay="300">
                        <h5 className="font-semibold text-slate-200 mb-3">Restez Informé</h5>
                        <p className="text-sm mb-3">Recevez nos dernières offres et actualités directement dans votre boîte mail.</p>
                        <form className="flex gap-2">
                            <Input type="email" placeholder="Votre email" className="bg-slate-800 border-slate-700 text-slate-300 placeholder:text-slate-500 flex-grow" />
                            <Button type="submit" variant="ghost" size="icon" className="bg-primary hover:bg-primary/90 text-white flex-shrink-0">
                                <Send className="h-5 w-5" />
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Ligne de séparation */}
                <div className="border-t border-slate-700 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-center sm:text-left mb-4 sm:mb-0">
                        © {currentYear} Tour Congo. Tous droits réservés.
                    </p>
                    <div className="flex space-x-4">
                        {socialLinks.map(social => (
                            <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}
                                className="text-slate-400 hover:text-primary transition-colors">
                                <social.icon className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}