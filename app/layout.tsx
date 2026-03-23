import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue, Cormorant_Garamond, Cairo } from "next/font/google";
import "./globals.css";
import IntroAnimation from "./components/IntroAnimation";
import { LanguageProvider } from "./context/LanguageContext";
import { LoadingProvider } from "./context/LoadingContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Baz Holding | Global Marketing Agency",
  description:
    "Baz Holding drives transformative growth for the world's most ambitious companies — from strategy to execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${cormorant.variable} ${cairo.variable} h-full antialiased`}
    >
      <head>
        {/* Preload first 5 frames so the canvas has something to paint before JS runs */}
        {[0,1,2,3,4].map(i => (
          <link
            key={i}
            rel="preload"
            as="image"
            href={`/Frames/SSbg${String(i).padStart(3,'0')}.png`}
            // @ts-expect-error fetchpriority is valid HTML but not yet in TS types
            fetchpriority="high"
          />
        ))}
      </head>
      <body className="min-h-full flex flex-col bg-black">
        <script dangerouslySetInnerHTML={{ __html: `history.scrollRestoration='manual';window.scrollTo(0,0);` }} />
        <LoadingProvider>
          <LanguageProvider>
            <IntroAnimation fontClass={bebasNeue.className} />
            {children}
          </LanguageProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
