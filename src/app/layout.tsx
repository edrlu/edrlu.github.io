import type { Metadata } from 'next'
import '@/styles/globals.css'
import SiteChrome from '@/components/chrome/SiteChrome'

export const metadata: Metadata = {
  title: 'Edward Lu - Portfolio',
  description: 'Statistics & Data Science | UC Berkeley',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
