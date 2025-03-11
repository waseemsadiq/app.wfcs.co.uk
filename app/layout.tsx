import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { InitStore } from "@/lib/init-store"
import { AuthProvider } from "@/lib/hooks/use-auth"
import { LeagueDataProvider } from "@/lib/hooks/use-league-data"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Soccer League PWA",
  description: "A web-based Progressive Web App for soccer league management",
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LeagueDataProvider>
            <InitStore />
            {children}
            <Toaster />
          </LeagueDataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'