import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from "next/font/google";
import { ReduxProvider } from "@/components/ReduxProvider";
import { ThemeProvider, ThemeSynchronizer } from "@/components/ThemeProvider";


const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tour congo | Vitrine du potentiel touristique du potentiel touristique et immobilier de la RDC",
  description: "Vitrine du potentiel touristique du potentiel touristique et immobilier de la RDC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased {inter.className}`}
      >
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeSynchronizer />
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
