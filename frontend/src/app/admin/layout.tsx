import { Outfit } from 'next/font/google';
import type { Metadata } from 'next';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import {AppLayoutContent} from '@/components/layout/AppLayoutContent';
import { AuthProvider } from '@/context/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminGuard } from '@/components/AdminGuard'
import { ToastProvider } from '@/context/ToastContext';
import { ToastContainer } from '@/components/ui/Toast';



import './globals.css';

const outfit = Outfit({
  subsets: ["latin"],
   display: "swap",
});

export const metadata: Metadata = {
  title: "Mawami",
  description: "Your Story Begins Here",
  openGraph: {
    title: "Mawami",
    description: "Your Story Begins Here",
    siteName: "Mawami",
    url: 'https://mawami.com',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://mawami.com/images/logo/logo-square.jpeg',
        width: 300,
        height: 300,
        alt: 'Mawami - Your Story Begins Here',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Mawami',
    description: 'Your Story Begins Here',
    images: ['https://mawami.com/images/logo/logo-square.jpeg'],
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={`${outfit.className} bg-white-100 dark:bg-gray-900`} >
        <AuthProvider>
          <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
            <AdminGuard>
              <ThemeProvider>
                <SidebarProvider>
                  <ToastProvider>
                    <AppLayoutContent>{children}</AppLayoutContent>
                    <ToastContainer />
                  </ToastProvider>
                </SidebarProvider>
              </ThemeProvider>
            </AdminGuard>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}

