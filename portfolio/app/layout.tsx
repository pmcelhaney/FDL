import type { Metadata } from "next";
import { headers } from "next/headers";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: {
      default: "FDL — One definition, every surface",
      template: "%s — FDL",
    },
    description:
      "A field definition language for keeping forms, validation, tables, and export-oriented output consistent.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      type: "website",
      title: "FDL — Define the rule once. Keep every surface honest.",
      description:
        "One declarative field definition keeps input, validation, review, and export in sync.",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "FDL field definition flowing to form, validation, review, and export" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "FDL — Define the rule once. Keep every surface honest.",
      description:
        "One declarative field definition keeps input, validation, review, and export in sync.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
