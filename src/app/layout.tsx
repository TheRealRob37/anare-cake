import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: {
    default: "Anare Cake — Անհատական Տորթեր Երևանում",
    template: "%s | Anare Cake",
  },
  description:
    "Ձեռագործ շքեղ տորթեր Երևանում։ Անհատական պատվերներ, 3D կոնֆիգուրատոր, առաքում։ @anare_cake",
  keywords: ["տորթ", "cake", "Երևան", "Yerevan", "custom cake", "бисквит", "торт на заказ"],
  authors: [{ name: "Anare Cake" }],
  creator: "Anare Cake",
  openGraph: {
    type: "website",
    locale: "hy_AM",
    siteName: "Anare Cake",
    title: "Anare Cake — Անհատական Տորթեր",
    description: "Ձեռագործ շքեղ տորթեր ձեր ամենաթանկ պահերի համար",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hy" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="noise-overlay">
        <I18nProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
