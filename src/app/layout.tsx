import type { Metadata } from "next";
import "./globals.css";
import PublicShell from "@/components/layout/PublicShell";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: {
    default: "Anare Cake — Custom Cakes in Yerevan",
    template: "%s | Anare Cake",
  },
  description:
    "Handcrafted luxury cakes in Yerevan. Custom orders, 3D cake configurator, delivery. @anare_cake",
  keywords: ["cake", "Yerevan", "custom cake", "luxury cake", "wedding cake", "birthday cake", "Armenia"],
  authors: [{ name: "Anare Cake" }],
  creator: "Anare Cake",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Anare Cake",
    title: "Anare Cake — Custom Cakes in Yerevan",
    description: "Handcrafted luxury cakes for your most precious moments",
  },
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hy" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Great+Vibes&family=Pacifico&family=Playfair+Display:ital@1&family=Sacramento&family=Pinyon+Script&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise-overlay">
        <I18nProvider>
          <PublicShell>{children}</PublicShell>
        </I18nProvider>
      </body>
    </html>
  );
}
