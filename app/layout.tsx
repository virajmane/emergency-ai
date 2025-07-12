import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EmergencyAI - Intelligent Emergency Response Assistant",
  description:
    "AI-powered emergency response assistant that finds the nearest emergency services and provides intelligent guidance during critical situations.",
  keywords: "emergency, AI, first aid, hospital finder, emergency services, location-based emergency help",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
