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
    url: 'https://mawami.com/',
    type: 'website',
    images: [
      {
        url: '/images/logo/logo-square.jpg',
        height: 630,
        alt: 'Mawami - Your Story Begins Here',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: '@yourtwitterhandle', // Replace with your Twitter handle
    title: "Mawami",
    description: "Your Story Begins Here",
    images: [
      {
        url: 'https://yourdomain.com/images/logo/logo-transparent.png', // Replace with your actual domain
        alt: 'Mawami - Your Story Begins Here',
      },
    ],
  },
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
