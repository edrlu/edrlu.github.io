'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SiteBackground from '@/components/chrome/SiteBackground'
import SiteNav from '@/components/chrome/SiteNav'
import ThemeToggle from '@/components/chrome/ThemeToggle'

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showChrome = pathname === '/'

  return (
    <>
      <SiteBackground />
      <div className="grain" aria-hidden="true" />

      <div className={showChrome ? 'shell' : 'shell isNoChrome'}>
        {showChrome ? (
          <header className="siteHeader">
            <div className="siteTitle">
              <Link className="siteTitleLink" href="/">
                Edward Lu
              </Link>
              <div className="siteTitleMeta">
                Statistics &amp; Data Science {'\u00B7'} UC Berkeley
              </div>
            </div>
            <SiteNav />
          </header>
        ) : null}

        <main id="content" className="pageContent">
          {children}
        </main>

        {showChrome ? (
          <footer className="siteFooter">
            <ThemeToggle />
            <div className="footerLinks">
              <a href="https://github.com/edrlu" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/edward-lu-a68aa724b/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </footer>
        ) : null}
      </div>

      <div className="frame" aria-hidden="true">
        <div className="frameLine frameLineTop" />
        <div className="frameLine frameLineRight" />
        <div className="frameLine frameLineBottom" />
        <div className="frameLine frameLineLeft" />
      </div>
    </>
  )
}

