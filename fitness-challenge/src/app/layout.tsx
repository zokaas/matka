import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";


export const metadata: Metadata = {
  title: "Petolliset",
  description: "Petolliset",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const response = await fetch("http://localhost:5001/users");
    const users = await response.json();
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <NavBar users={users} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
