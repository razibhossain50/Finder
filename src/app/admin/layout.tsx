import { Outfit } from 'next/font/google';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import {LayoutContent} from '@/components/layout/LayoutContent';

import './globals.css';

const outfit = Outfit({
  subsets: ["latin"],
   display: "swap",
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <LayoutContent>{children}</LayoutContent>
          </SidebarProvider>
        </ThemeProvider>
        </body>
        </html>
      );
}

