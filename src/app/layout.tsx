import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/ReduxProvider";
import { ThemeProvider, ThemeSynchronizer } from "@/components/ThemeProvider";
import { SiteHeader } from "@/components/Header";
import { AuthInitializer } from "@/components/AuthInitializer";
import { AOSInitializer } from "@/components/AOSInitializer";
import { Footer } from "@/components/Footer";

// Polices avec les variables utilisées dans <body>
const inter = Inter({ subsets: ["latin"] });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "tour congo | Vitrine du potentiel touristique et immobilier de la RDC",
  description: "Vitrine du potentiel touristique et immobilier de la RDC",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.className} ${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeSynchronizer />
            <AuthInitializer>
              <AOSInitializer>
                <SiteHeader />
                {children}
                <Footer />
              </AOSInitializer>
            </AuthInitializer>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
};