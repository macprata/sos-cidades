import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOS Cidades - Governo de Sergipe | Secretaria de Obras",
  description:
    "Construindo uma Cidade Melhor para Todos: Denuncie Problemas Urbanos com o SOS Cidades",
  icons: {
    icon: "/sos_cidades_icone.png", // Ou '/sos_cidades_icon.png'
    shortcut: "/sos_cidades_icone.png",
    apple: "/sos_cidades_icone.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-right" expand={true} />
      </body>
    </html>
  );
}
