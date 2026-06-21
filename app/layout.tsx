import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ju-Jutsu Prüfungsprogramm — Builder",
  description:
    "Stelle dein Ju-Jutsu Prüfungsprogramm zusammen: Gürtelgrad wählen, Techniken und Verteidigungs-Flowcharts eintragen, als Link teilen oder als PDF exportieren.",
  applicationName: "Ju-Jutsu Prüfungsprogramm",
  authors: [{ name: "Ju-Jutsu Builder" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('juju:theme')==='light')document.documentElement.classList.add('light')}catch(e){}})()`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
