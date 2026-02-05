'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/portfolio', label: 'Portfolio' },
]

export default function SiteNav() {
  const pathname = usePathname()

  return (
    <nav className="siteNav" aria-label="Primary">
      <ol className="siteNavList">
        {navItems.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname === item.href || pathname?.startsWith(`${item.href}/`)

          return (
            <li key={item.href} className={isActive ? 'is-selected' : undefined}>
              <span className="navDot" aria-hidden="true">
                ·
              </span>
              <Link className="navLink" href={item.href}>
                {item.label}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

