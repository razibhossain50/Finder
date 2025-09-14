import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import './globals.css';
import { QueryProvider } from '@/components/common/QueryProvider';
import { RegularAuthProvider } from '@/context/RegularAuthContext';
import { HeroUIProvider } from '@heroui/react';
import { ToastProvider } from "@heroui/toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mawami",
  description: "Your Story Begins Here",
  openGraph: {
    title: "Mawami",
    description: "Your Story Begins Here",
    siteName: "Mawami",
    url: 'https://mawami.com',
    type: 'website',
    images: [
      {
        url: 'https://mawami.com/images/logo/logo-square.jpeg',
        width: 150,
        height: 150,
        alt: 'Mawami - Your Story Begins Here',
        type: 'image/jpg',
      },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className='min-h-screen bg-gray-50'>
        <HeroUIProvider>
          <ToastProvider placement="top-right" />
          <QueryProvider>
            <RegularAuthProvider>
              <Header />
              {children}
              <Footer />
            </RegularAuthProvider>
          </QueryProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
