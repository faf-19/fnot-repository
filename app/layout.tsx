import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "የተማሪ መመዝገቢያ እና መገኘት መቁጠሪያ ስርዓት",
  description: "Student Registration and Attendance System with Amharic Support",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="am" dir="ltr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta charSet="UTF-8" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
