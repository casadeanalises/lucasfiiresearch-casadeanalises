import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
import NavbarWrapper from "./_components/navbar-wrapper";

const mulish = Mulish({
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Lucas FII Research",
  description: "VENHA APRENDER A INVESTIR COM SABEDORIA!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload para fontes e outros recursos essenciais pode ficar aqui */}
      </head>
      <body className={`${mulish.className} dark antialiased`}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
          }}
        >
          <div className="flex h-full flex-col overflow-hidden">
            <NavbarWrapper />
            {children}
          </div>
        </ClerkProvider>

        <Toaster />
      </body>
    </html>
  );
}
