import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/provider/authProvider";

export const metadata: Metadata = {
  title: "RJV",
  description: "blog discussion échange",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="fr">
        <body className="border mx-auto p-3.5 h-dvh">

          <main className="flex flex-col items-center justify-center w-full h-full">
            {children}
          </main>

        </body>
      </html>
    </AuthProvider >
  );
}
