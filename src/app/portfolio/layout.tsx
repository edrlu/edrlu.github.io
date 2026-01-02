'use client'

import PasswordProtection from '@/components/auth/PasswordProtection'

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PasswordProtection>
      {children}
    </PasswordProtection>
  )
}
