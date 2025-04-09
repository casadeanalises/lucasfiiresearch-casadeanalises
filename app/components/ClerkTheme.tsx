import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";

const theme = {
  baseTheme: dark,
  variables: {
    colorBackground: "#1a1a1a",
    colorInputBackground: "#2a2a2a",
    colorInputText: "#ffffff",
    colorText: "#ffffff",
    colorTextSecondary: "#e0e0e0",
    colorPrimary: "#3b82f6",
    colorDanger: "#ef4444",
    colorSuccess: "#22c55e",
    borderRadius: "0.375rem",
  },
};

export function ClerkThemeProvider({ children }: { children: React.ReactNode }) {
  return <ClerkProvider appearance={theme}>{children}</ClerkProvider>;
} 