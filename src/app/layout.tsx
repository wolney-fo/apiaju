import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApiAju - Em desenvolvimento",
  description: "ApiAju é um conjunto de ferramentas web relacionadas à cidade de Aracaju.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
