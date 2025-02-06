import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";

export const metadata: Metadata = {
  title: "Petolliset",
  description: "Petolliset",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
