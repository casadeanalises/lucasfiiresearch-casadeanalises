import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import NavbarWrapper from "./_components/navbar-wrapper";

const theme = {
  variables: {
    colorBackground: "#ffffff",
    colorInputBackground: "#f3f4f6",
    colorInputText: "#000000",
    colorText: "#000000",
    colorTextSecondary: "#4b5563",
    colorPrimary: "#3b82f6",
    colorDanger: "#ef4444",
    colorSuccess: "#22c55e",
    borderRadius: "0.375rem",
  },
  elements: {
    card: {
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
    },
    navigationButton: {
      color: "#000000",
    },
    userButtonPopup: {
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
    },
    userButtonTrigger: {
      filter: "none",
    },
    userPreviewMainIdentifier: {
      color: "#000000",
    },
    userPreviewSecondaryIdentifier: {
      color: "#4b5563",
    },
    menuItem: {
      textColor: "#000000",
      hoverBackgroundColor: "#f3f4f6",
    },
    dividerLine: {
      backgroundColor: "#e5e7eb",
    },
    footerText: {
      color: "#4b5563",
    },
    footerActionLink: {
      color: "#3b82f6",
    },
    avatarBox: {
      backgroundColor: "#f3f4f6",
    },
    userButtonBox: {
      color: "#000000",
    },
    userPreviewTextContainer: {
      color: "#000000",
    },
    userButtonOuterIdentifier: {
      color: "#000000",
    },
    userButtonInnerIdentifier: {
      color: "#000000",
    },
    formFieldLabel: {
      color: "#000000",
    },
    formFieldInput: {
      color: "#000000",
    },
    formButtonPrimary: {
      backgroundColor: "#3b82f6",
      color: "#ffffff",
    },
    formButtonReset: {
      color: "#000000",
    },
    navbarButton: {
      color: "#000000",
    },
    headerTitle: {
      color: "#000000",
    },
    headerSubtitle: {
      color: "#4b5563",
    },
  },
};

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
     
      </head>
      <body className={`${mulish.className} dark antialiased`}>
        <ClerkProvider appearance={theme}>
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
