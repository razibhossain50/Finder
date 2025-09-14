import { Outfit } from 'next/font/google';
import type { Metadata } from 'next';
import "../../../admin/globals.css";

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
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

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-white-100 dark:bg-gray-900`}>
        {children}
      </body>
    </html>
  );
}
