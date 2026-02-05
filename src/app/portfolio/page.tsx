import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import styles from './portfolio.module.css'

type Card = {
  title: string
  subtitle: string
  metaLeft: string
  metaRight: string
  href?: string
  imageSrc?: string
  imageAlt?: string
  mediaHeight?: number
}

const projectCards: Card[] = [
  {
    title: 'Beryl',
    subtitle: 'A calendar-first stopwatch tracker with recurrence and SQLite persistence.',
    metaLeft: 'Personal project',
    metaRight: '2024–2025',
    href: 'https://github.com/edrlu/beryl',
    imageSrc: '/gallery/beryl-demo.png',
    imageAlt: 'Beryl demo screenshot',
    mediaHeight: 320,
  },
  {
    title: 'Insider Correlation Toolkit',
    subtitle:
      'Insider-trade correlation analysis with forward returns (+7d/+14d/+30d) and backtesting experiments.',
    metaLeft: 'Research tooling',
    metaRight: '2025–2026',
    imageSrc: '/gallery/insider-correlation-analysis.png',
    imageAlt: 'Insider correlation analysis plot',
    mediaHeight: 240,
  },
  {
    title: 'Coach',
    subtitle: 'Visual analytics and tooling for map-state interpretation and replay artifacts.',
    metaLeft: 'ML / visualization',
    metaRight: '2025',
    href: '/portfolio/coach-replay',
    imageSrc: '/gallery/coach-map.jpeg',
    imageAlt: 'Coach map visualization',
    mediaHeight: 410,
  },
]

const researchCards: Card[] = [
  {
    title:
      'Hydrogen sulfide ameliorates peritoneal fibrosis: inhibition of HMGB1 to block TGF-\u03B2/Smad3 activation',
    subtitle:
      'Peritoneal fibrosis pathways: HMGB1 and TGF-\u03B2/Smad3 signaling (open access).',
    metaLeft: 'Publication',
    metaRight: 'PMCID',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12413889/',
    imageSrc: '/gallery/paper1-affiliation.png',
    imageAlt: 'Evidence of affiliation screenshot',
    mediaHeight: 285,
  },
  {
    title:
      'ATR-binding lncRNA ScaRNA2 promotes cancer resistance through facilitating efficient DNA end resection during homologous recombination repair',
    subtitle: 'DNA repair and resistance via lncRNA interactions (PubMed).',
    metaLeft: 'Publication',
    metaRight: 'PubMed',
    href: 'https://pubmed.ncbi.nlm.nih.gov/37775817/',
    mediaHeight: 210,
  },
]

function PortfolioCard({ card }: { card: Card }) {
  const isLink = Boolean(card.href)
  const isInternal = Boolean(card.href?.startsWith('/'))

  const mediaStyle = {
    ['--media-h' as string]: `${Math.max(180, card.mediaHeight ?? 260)}px`,
  } as CSSProperties

  const inner = (
    <div className={styles.cardInner} style={mediaStyle}>
      <div className={styles.cardMedia} aria-hidden="true">
        {card.imageSrc ? (
          <Image
            src={card.imageSrc}
            alt={card.imageAlt ?? ''}
            fill
            sizes="(max-width: 820px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
            priority={false}
          />
        ) : (
          <div className={styles.cardMediaFallback} />
        )}
      </div>

      <div className={styles.cardCaption}>
        <div className={styles.cardMeta}>
          <span>{card.metaLeft}</span>
          <span aria-hidden="true">{'\u00B7'}</span>
          <span>{card.metaRight}</span>
        </div>
        <div className={styles.cardTitle}>{card.title}</div>
        <div className={styles.cardSubtitle}>{card.subtitle}</div>
      </div>
    </div>
  )

  if (!isLink || !card.href) {
    return <div className={styles.card}>{inner}</div>
  }

  if (isInternal) {
    return (
      <Link className={`${styles.card} ${styles.cardLink}`} href={card.href}>
        {inner}
      </Link>
    )
  }

  return (
    <a className={`${styles.card} ${styles.cardLink}`} href={card.href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  )
}

export default function Portfolio() {
  return (
    <section className="contentPanel" aria-label="Portfolio">
      <div className="contentPanelGrid">
        <aside className="contentPanelLeft">
          <Link className={styles.backLink} href="/">
            {'\u2190'} Back
          </Link>
          <h1 className="contentPanelTitle">Portfolio</h1>
          <nav className={styles.outline} aria-label="Outline">
            <div className={styles.outlineTitle}>Outline</div>
            <a className={styles.outlineLink} href="#projects">
              Projects
            </a>
            <a className={styles.outlineLink} href="#research">
              Research
            </a>
          </nav>
        </aside>

        <div className="contentPanelRight">
          <section id="projects" className={styles.block} aria-label="Projects">
            <div className={styles.blockTitle}>Projects</div>
            <div className={styles.cardMasonry}>
              {projectCards.map((card) => (
                <PortfolioCard key={card.title} card={card} />
              ))}
            </div>
          </section>

          <section id="research" className={styles.block} aria-label="Research">
            <div className={styles.blockTitle}>Research</div>
            <div className={styles.cardMasonry}>
              {researchCards.map((card) => (
                <PortfolioCard key={card.title} card={card} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
