"use client";
import { Outfit } from 'next/font/google';
import { useSidebar, SidebarProvider } from '@/context/admin/SidebarContext';
import { ThemeProvider } from '@/context/admin/ThemeContext';
import AppHeader from "@/layout/admin/AppHeader";
import AppSidebar from "@/layout/admin/AppSidebar";
import Backdrop from "@/layout/admin/Backdrop";
import './globals.css';

const outfit = Outfit({
  subsets: ["latin"],
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
            <LayoutContent children={children} />
          </SidebarProvider>
        </ThemeProvider>
        </body>
        </html>
      );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  
  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";
  
  return (
    <>
      <AppSidebar />
      <div className="min-h-screen xl:flex">
        {/* Sidebar and Backdrop */}
        <Backdrop />
        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          {/* Header */}
          <AppHeader />
          {/* Page Content */}
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
        </div>
      </div>
    </>
  );
}