import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import { AuthProvider } from "./contexts/AuthContext";

export const metadata: Metadata = {
  title: "Huippujen Valloitus",
  description: "Kiipeä Everesin huipulle yhdessä!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fi">
      <head>
        <link rel="icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        <meta
          httpEquiv="Cache-Control"
          content="no-cache, no-store, must-revalidate"
        />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}