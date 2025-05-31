
import Header from "@/layout/client/Header";
import Footer from "@/layout/client/Footer";
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
            <Header />
            {children}
            <Footer />
      </body>
    </html>
  );
}
