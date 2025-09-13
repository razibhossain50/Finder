import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './profinder.css';
import { QueryProvider } from '@/components/common/QueryProvider';
import { RegularAuthProvider } from '@/context/RegularAuthContext';
import { HeroUIProvider } from '@heroui/react';
import { ToastProvider } from "@heroui/toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Services",
  description: "Find Trusted Professionals",
  openGraph: {
    title: "Professional Services",
    description: "Find Trusted Professionals",
    siteName: "Professional Services",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Services",
    description: "Find Trusted Professionals",
  },
};

export default function ProfessionalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className='min-h-screen bg-gray-50' suppressHydrationWarning={true}>
        <HeroUIProvider>
          <ToastProvider placement="top-right" />
          <QueryProvider>
            <RegularAuthProvider>
              <Header type="profinder" />
              {children}
              <Footer type="profinder" />
            </RegularAuthProvider>
          </QueryProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}