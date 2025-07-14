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
  becomeHost
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
import { cn } from "@/lib/utils";
import { SearchBar } from "./SearchBar";
import { useRouter } from "next/navigation";
import { Role } from "@prisma/client";
import { toast } from "sonner";
import { error } from "console";


// Définition du type pour les éléments de navigation
interface NavItemConfig {
  href: string;
  label: string;
  icon?: React.ElementType;
  isNew?: boolean;
}

const SCROLL_THRESHOLD_OPAQUE_HEADER = 50;
const SCROLL_THRESHOLD_SWITCH_TO_SEARCH = 10;

export function SiteHeader() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  // Récupérer l'état d'authentification depuis Redux
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // États pour contrôler l'ouverture des popups
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [showSearchInHeader, setShowSearchInHeader] = useState(false);

  const actualNavLinks: NavItemConfig[] = [
    { href: "/tourisme", label: "Tourisme", icon: Home, isNew: false },
    { href: "/restaurant", label: "Restaurant & Services", icon: Sparkles, isNew: true },
    { href: "/logement", label: "Logements", icon: BellRing, isNew: true },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    // Rediriger vers la page d'accueil ou autre après déconnexion
    router.push('/');
  };

  const handleBecomeHost = () => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }
    toast.promise(dispatch(becomeHost()).unwrap(), {
      loading: 'Mise à jour de votre statut...',
      success: (updatedUser) => {
        return `Félicitations, ${updatedUser.name} ! Vous êtes maintenant un hôte.`;
      },
      error: (error) => {
        // `error` est la valeur de rejectWithValue
        return error || 'une erreur est survenue.'
      }
    })
  }

  // Fermer les popups si l'utilisateur est authentifié (par exemple, après une connexion réussie)
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoginOpen(false);
      setIsRegisterOpen(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const scrolledEnoughForOpaque = offset > SCROLL_THRESHOLD_OPAQUE_HEADER;
      const scrolledEnoughForSearch = offset > SCROLL_THRESHOLD_SWITCH_TO_SEARCH;

      if (isHeaderScrolled !== scrolledEnoughForOpaque) {
        setIsHeaderScrolled(scrolledEnoughForOpaque);
      }
      if (showSearchInHeader !== scrolledEnoughForSearch) {
        setShowSearchInHeader(scrolledEnoughForSearch);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHeaderScrolled, showSearchInHeader]);

  const isHomePageWithHero = pathname === "/";

  // Définition des styles pour les modes du header
  const headerBaseClasses = "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out";

  // Mode "transparent" (en fait semi-transparent et flouté, respectant le thème)
  // Utilisez une opacité très faible pour le fond, et un backdrop-blur
  // Les couleurs de texte/icônes utiliseront les variables de thème (foreground, muted-foreground)
  const headerSemiTransparentClasses = "bg-background/15 backdrop-blur-sm border-b border-transparent";

  // Mode opaque standard
  const headerOpaqueClasses = "bg-background/90 backdrop-blur-md shadow-md border-b border-border/40";

  // Déterminer les classes actuelles du header
  // Le texte sera toujours 'text-foreground' ou 'text-muted-foreground' par défaut
  const currentHeaderClasses = isHomePageWithHero && !isHeaderScrolled
    ? headerSemiTransparentClasses
    : headerOpaqueClasses;

  // Ce booléen peut être utile pour des ajustements fins si nécessaire, mais on essaie de l'éviter
  // const isEffectivelyTransparentMode = isHomePageWithHero && !isHeaderScrolled;

  // Logique pour la SearchBar centrale que vous aviez
  const handleCentralNavTriggerClick = () => {
    // Si on clique sur la nav alors que la search bar devrait être là, on la force
    if (!showSearchInHeader) {
      setShowSearchInHeader(true);
      // Forcer un scroll léger pour s'assurer que l'état du header est bien "scrolled"
      if (window.scrollY <= SCROLL_THRESHOLD_SWITCH_TO_SEARCH) {
        window.scrollTo({ top: SCROLL_THRESHOLD_SWITCH_TO_SEARCH + 1, behavior: 'smooth' });
      }
    } else {
      // Si la search bar est déjà affichée dans le header, on pourrait vouloir focus
      // la search bar principale sur la page (si elle existe)
      const mainSearchBarInput = document.getElementById("main-search-bar-input"); // Assurez-vous que cet ID existe sur votre SearchBar principale
      if (mainSearchBarInput) {
        mainSearchBarInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => mainSearchBarInput.focus(), 300); // léger délai pour le scroll
      }
    }
  };

  // --- COMPOSANT INTERNE POUR LE BOUTON D'ACTION HÔTE ---
  const HostActionButton = () => {
    // Si l'utilisateur est un ADMIN ou SUPER_ADMIN, il est déjà un hôte.
    if (isAuthenticated && (currentUser?.role === Role.ADMIN || currentUser?.role === Role.SUPER_ADMIN || currentUser?.role === Role.HOST)) {
      return (
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/listings/new')} // Redirige vers la page de création d'annonce
          className="hidden sm:inline-flex text-sm font-medium rounded-full px-4 py-2 hover:bg-accent focus:bg-accent text-foreground"
        >
          Ajouter un logement
        </Button>
      );
    }

    // Sinon (non connecté ou simple USER), il voit "Devenir hôte".
    return (
      <Button
        variant="ghost"
        onClick={handleBecomeHost}
        className="hidden sm:inline-flex text-sm font-medium rounded-full px-4 py-2 hover:bg-accent focus:bg-accent text-foreground"
      >
        Devenir hôte
      </Button>
    );
  };

  // --- COMPOSANT INTERNE POUR L'ITEM DE MENU HÔTE ---
  const HostMenuItem = () => {
    if (isAuthenticated && (currentUser?.role === Role.ADMIN || currentUser?.role === Role.SUPER_ADMIN)) {
      return (
        <DropdownMenuItem onSelect={() => router.push('/dashboard/listings')}>
          <Home className="mr-2 h-4 w-4" />
          Mode Hôte
        </DropdownMenuItem>
      );
    }

    // Si simple USER
    if (isAuthenticated && currentUser?.role === Role.USER) {
      return (
        <DropdownMenuItem onSelect={handleBecomeHost}>
          Devenir hôte
        </DropdownMenuItem>
      );
    }

    // Si non connecté
    return (
      <DropdownMenuItem onSelect={handleBecomeHost}>
        Devenir hôte
      </DropdownMenuItem>
    );
  };

  return (
    <>
      <header
        className={cn(
          headerBaseClasses,
          currentHeaderClasses
        )}
      >
        <div
          className="container flex h-16 md:h-20 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8"
        >
          {/* Section Gauche: Logo */}
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Logo">
              <path d="M29.8665 10.3511C29.9465 9.54311 29.4025 8.79811 28.6115 8.51411C27.8205 8.23111 26.9335 8.47711 26.4705 9.11311L24.0005 12.7331V4.93411C24.0005 4.24911 23.4135 3.69411 22.6875 3.69411C21.9615 3.69411 21.3755 4.24911 21.3755 4.93411V10.5481L17.6165 4.66711C17.1485 3.92811 16.2435 3.61411 15.4085 3.81711C14.5745 4.02011 13.9545 4.71311 13.9235 5.55311L13.6965 11.0871L10.6245 5.01011C10.1735 4.14511 9.25051 3.74211 8.34351 3.95711C7.43651 4.17311 6.80051 4.94411 6.75751 5.84411L6.30251 15.6441L3.53151 10.1611C3.07451 9.27211 2.15851 8.87011 1.25851 9.10211C0.357511 9.33311 -0.156489 10.1381 0.0335114 11.0371C0.223511 11.9371 0.969511 12.5841 1.84251 12.6351L1.90251 12.6381L5.12551 28.0001H5.15251C5.48851 28.0001 5.80051 27.7941 5.93451 27.4881L10.1165 17.8911L12.9385 27.4881C13.0725 27.7941 13.3855 28.0001 13.7205 28.0001H13.7475L17.1525 16.0351L19.8255 27.4881C19.9595 27.7941 20.2725 28.0001 20.6075 28.0001H20.6345L26.0985 10.6991C26.0995 10.6961 26.1005 10.6941 26.1025 10.6911L29.8665 10.3511Z"
                fill="#FF5A5F" // Garder la couleur principale du logo constante. La lisibilité sera assurée par le fond du header.
              />
            </svg>
            <span className="font-bold text-xl text-[#FF5A5F] hidden sm:inline-block"> {/* Idem pour le texte du logo */}
              Tour Congo
            </span>
          </Link>

          {/* Section Centrale: Navigation ou SearchBar */}
          <div className="flex-1 flex justify-center items-center min-w-0 px-2 sm:px-0 relative h-12">
            {/* Logique pour afficher soit la nav, soit la search bar compacte */}
            {/* Version simplifiée: la nav est toujours là, la search bar compacte apparait dessus si isHeaderScrolled */}
            <div
              className={cn(
                "flex items-center justify-center transition-opacity duration-300",
                showSearchInHeader ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
              onClick={!showSearchInHeader ? handleCentralNavTriggerClick : undefined}
              role={!showSearchInHeader ? "button" : undefined}
              tabIndex={!showSearchInHeader ? 0 : undefined}
              onKeyDown={!showSearchInHeader ? (e) => e.key === 'Enter' && handleCentralNavTriggerClick() : undefined}
            >
              <nav className="flex items-center justify-center gap-1 sm:gap-2">
                {actualNavLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative group flex items-center px-2 sm:px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                      // La couleur de base est gérée par la classe text-foreground/text-muted-foreground du header parent
                      pathname === item.href ? "text-foreground font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {item.icon && <item.icon className={cn("h-5 w-5 mr-1.5 hidden sm:inline-block", pathname === item.href ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />}
                    <span>{item.label}</span>
                    {pathname === item.href && (
                      <span className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full mt-1", "bg-foreground")}></span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
            {/* Barre de recherche compacte dans le header */}
            <div
              className={cn(
                "flex items-center justify-center w-auto transition-opacity duration-300 absolute inset-0",
                showSearchInHeader ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              {/* Le composant SearchBar doit être stylé pour bien s'intégrer ici */}
              <SearchBar inHeaderCompactMode={true} />
            </div>
          </div>


          {/* Section Droite: Actions utilisateur */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-4">
            <HostActionButton />
            <ThemeToggleButton />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline" // S'adapte au thème
                  className={cn(
                    "flex h-10 w-auto items-center gap-2 rounded-full px-2 py-1.5 pl-3 hover:shadow-md transition-shadow",
                    "border-border text-foreground" // Utiliser border-border et text-foreground pour s'adapter
                  )}
                >
                  <MenuIcon className="h-5 w-5" /> {/* Héritera la couleur du texte */}
                  <Avatar className="h-7 w-7">
                    {isAuthenticated && currentUser?.name ? (
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {currentUser.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-muted text-muted-foreground"> {/* s'adapte au thème */}
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
                        <p className="text-sm font-medium leading-none">
                          {currentUser.name || currentUser.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => alert('Profil')}>Profil</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => alert('Voyages')}>Mes voyages</DropdownMenuItem>
                    {/* Utiliser notre item de menu conditionnel */}
                    <HostMenuItem />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={handleLogout}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                    </DropdownMenuItem>
                  </>
                ) : (
                  // --- MENU UTILISATEUR DÉCONNECTÉ ---
                  <>
                    <DropdownMenuItem
                      onSelect={
                        () => {
                          setIsRegisterOpen(true);
                          setIsLoginOpen(false);
                        }
                      }
                      className="font-semibold"
                    >
                      Inscription
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={
                        () => {
                          setIsLoginOpen(true);
                          setIsRegisterOpen(false);
                        }
                      }
                    >
                      Connexion
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* Le bouton est aussi ici */}
                    <HostMenuItem />
                    <DropdownMenuItem>Aide</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <Dialog
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
      >
        <DialogContent
          className="sm:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle>Connexion</DialogTitle>
            <DialogDescription>Accédez à votre compte pour continuer.</DialogDescription>
          </DialogHeader>
          <LoginForm />
        </DialogContent>
      </Dialog>
      <Dialog
        open={isRegisterOpen} onOpenChange={setIsRegisterOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Inscription</DialogTitle>
            <DialogDescription>Créez un compte pour profiter de toutes nos fonctionnalités.</DialogDescription>
          </DialogHeader><RegisterForm /></DialogContent></Dialog>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8 pt-20 md:pt-24" id="main-search-bar-anchor"> {/* Ajout de padding-top */}
        <SearchBar />
      </div>
    </>
  );
};