import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SelectionProvider } from "@/components/providers/selection-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tool Bag — Claude Code & Codex Ecosystem Tools",
  description:
    "Browse, select, and export configuration files for the Claude Code and OpenAI Codex ecosystem. Skills, MCP servers, multi-agent tools, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <NuqsAdapter>
          <TooltipProvider>
            <SelectionProvider>
              <SiteHeader />
              <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
              <SiteFooter />
            </SelectionProvider>
          </TooltipProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
