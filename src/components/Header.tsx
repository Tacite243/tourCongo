// src/components/SiteHeader.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu as MenuIcon, UserCircle, LogOut, Home, Sparkles, BellRing } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  logoutUser,
} from '@/redux/slices/authSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import React, { useState, useEffect } from "react";

// Définition du type pour les éléments de navigation
interface NavItem {
  href: string;
  label: string;
  icon?: React.ElementType;
  isNew?: boolean;
}

export function SiteHeader() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  // Récupérer l'état d'authentification depuis Redux
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // États pour contrôler l'ouverture des popups
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const navItems: NavItem[] = [
    { href: "/logements", label: "Logements", icon: Home, isNew: false },
    { href: "/experiences", label: "Expériences", icon: Sparkles, isNew: true },
    { href: "/services", label: "Services", icon: BellRing, isNew: true },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    // Optionnel: rediriger vers la page d'accueil ou autre après déconnexion
    // router.push('/');
  };

  // Fermer les popups si l'utilisateur est authentifié (par exemple, après une connexion réussie)
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoginOpen(false);
      setIsRegisterOpen(false);
    }
  }, [isAuthenticated]);


  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-9">
          {/* Section Gauche: Logo */}
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <svg /* Votre SVG Logo */ width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Logo">
              <path d="M29.8665 10.3511C29.9465 9.54311 29.4025 8.79811 28.6115 8.51411C27.8205 8.23111 26.9335 8.47711 26.4705 9.11311L24.0005 12.7331V4.93411C24.0005 4.24911 23.4135 3.69411 22.6875 3.69411C21.9615 3.69411 21.3755 4.24911 21.3755 4.93411V10.5481L17.6165 4.66711C17.1485 3.92811 16.2435 3.61411 15.4085 3.81711C14.5745 4.02011 13.9545 4.71311 13.9235 5.55311L13.6965 11.0871L10.6245 5.01011C10.1735 4.14511 9.25051 3.74211 8.34351 3.95711C7.43651 4.17311 6.80051 4.94411 6.75751 5.84411L6.30251 15.6441L3.53151 10.1611C3.07451 9.27211 2.15851 8.87011 1.25851 9.10211C0.357511 9.33311 -0.156489 10.1381 0.0335114 11.0371C0.223511 11.9371 0.969511 12.5841 1.84251 12.6351L1.90251 12.6381L5.12551 28.0001H5.15251C5.48851 28.0001 5.80051 27.7941 5.93451 27.4881L10.1165 17.8911L12.9385 27.4881C13.0725 27.7941 13.3855 28.0001 13.7205 28.0001H13.7475L17.1525 16.0351L19.8255 27.4881C19.9595 27.7941 20.2725 28.0001 20.6075 28.0001H20.6345L26.0985 10.6991C26.0995 10.6961 26.1005 10.6941 26.1025 10.6911L29.8665 10.3511Z" fill="#FF5A5F"/>
            </svg>
            <span className="font-bold text-xl text-[#FF5A5F] hidden sm:inline-block">
              Tour Congo
            </span>
          </Link>

          {/* Section Centrale: Navigation (inchangée) */}
          <nav className="flex flex-1 items-center justify-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative group flex flex-col items-center px-2 sm:px-3 py-2 text-sm font-medium transition-colors hover:text-foreground ${pathname === item.href ? "text-foreground" : "text-muted-foreground"}`}
              >
                <div className="flex items-center gap-1">
                  {item.icon && <item.icon className={`h-5 w-5 hidden sm:inline-block ${pathname === item.href ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />}
                  <span>{item.label}</span>
                </div>
                {pathname === item.href && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-foreground rounded-full mt-1"></span>}
              </Link>
            ))}
          </nav>

          {/* Section Droite: Actions utilisateur */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-4">
            <Button variant="ghost" className="hidden sm:inline-flex text-sm font-medium hover:bg-accent/60 dark:hover:bg-accent/30 rounded-full px-4 py-2">
              Devenir hôte
            </Button>
            <ThemeToggleButton />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex h-10 w-auto items-center gap-2 rounded-full border-border/70 px-2 py-1.5 pl-3 hover:shadow-md transition-shadow bg-card">
                  <MenuIcon className="h-5 w-5 text-foreground/80" />
                  <Avatar className="h-7 w-7">
                    {isAuthenticated && currentUser?.name ? ( /* Utiliser currentUser de Redux */
                      // Pour l'avatar, vous pouvez ajouter une URL d'avatar à votre modèle User et UserAuthInfo
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {currentUser.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        <UserCircle className="h-5 w-5" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isAuthenticated && currentUser ? (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{currentUser.name || currentUser.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => alert('Navigation vers profil')}>Profil</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => alert('Navigation vers voyages')}>Mes voyages</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50">
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onSelect={() => { setIsRegisterOpen(true); setIsLoginOpen(false); }} className="font-semibold">
                      Inscription
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => { setIsLoginOpen(true); setIsRegisterOpen(false); }}>
                      Connexion
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Devenir hôte</DropdownMenuItem>
                    <DropdownMenuItem>Aide</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Popup de Connexion */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connexion</DialogTitle>
            <DialogDescription>
              Accédez à votre compte pour continuer.
            </DialogDescription>
          </DialogHeader>
          <LoginForm /> {/* Votre composant LoginForm ici */}
          {/*
          <DialogFooter>
             Vous pourriez ajouter un lien "Pas encore de compte ? S'inscrire" ici
             qui fermerait ce dialog et ouvrirait le dialog d'inscription.
            <Button type="button" variant="link" onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }}>
              Pas encore de compte ? S'inscrire
            </Button>
          </DialogFooter>
          */}
        </DialogContent>
      </Dialog>

      {/* Popup d'Inscription */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Inscription</DialogTitle>
            <DialogDescription>
              Créez un compte pour profiter de toutes nos fonctionnalités.
            </DialogDescription>
          </DialogHeader>
          <RegisterForm /> {/* Votre composant RegisterForm ici */}
           {/*
          <DialogFooter>
            <Button type="button" variant="link" onClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }}>
              Déjà un compte ? Se connecter
            </Button>
          </DialogFooter>
          */}
        </DialogContent>
      </Dialog>
    </>
  );
}