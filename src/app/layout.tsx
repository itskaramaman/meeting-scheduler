import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CreateEventDrawer from "@/components/CreateEventDrawer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Meeting Scheduler",
  description: "A meeting scheduler app using NextJS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const header = await Header();
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable}  antialiased`}
        >
          {header}
          <main className="min-h-screen w-full bg-gradient-to-b from-indigo-50 to-white">
            {children}
          </main>
          <Footer />
          <CreateEventDrawer />
        </body>
      </html>
    </ClerkProvider>
  );
}
