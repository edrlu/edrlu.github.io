import Link from 'next/link'
import styles from './portfolio.module.css'
import PortfolioClient, { type PortfolioCardData, type PortfolioDetail } from './portfolioClient'

const projectCards: PortfolioCardData[] = [
  {
    title: 'Beryl',
    subtitle: 'A calendar-first stopwatch tracker with recurrence and SQLite persistence.',
    metaLeft: 'Personal project',
    metaRight: '2024–2025',
    imageSrc: '/gallery/beryl-demo.png',
    imageAlt: 'Beryl demo screenshot',
    mediaHeight: 320,
    action: { kind: 'detail', id: 'beryl' },
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
    action: { kind: 'detail', id: 'insider' },
  },
  {
    title: 'Coach',
    subtitle: 'Visual analytics and tooling for map-state interpretation and replay artifacts.',
    metaLeft: 'ML / visualization',
    metaRight: '2025',
    imageSrc: '/gallery/coach-map.jpeg',
    imageAlt: 'Coach map visualization',
    mediaHeight: 410,
    action: { kind: 'internal', href: '/portfolio/coach-replay' },
  },
]

const researchCards: PortfolioCardData[] = [
  {
    title:
      'Hydrogen sulfide ameliorates peritoneal fibrosis: inhibition of HMGB1 to block TGF-β/Smad3 activation',
    subtitle: 'Peritoneal fibrosis pathways: HMGB1 and TGF-β/Smad3 signaling (open access).',
    metaLeft: 'Publication',
    metaRight: 'PMCID',
    imageSrc: '/gallery/paper1-affiliation.png',
    imageAlt: 'Evidence of affiliation screenshot',
    mediaHeight: 285,
    action: { kind: 'external', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12413889/' },
  },
  {
    title:
      'ATR-binding lncRNA ScaRNA2 promotes cancer resistance through facilitating efficient DNA end resection during homologous recombination repair',
    subtitle: 'DNA repair and resistance via lncRNA interactions (PubMed).',
    metaLeft: 'Publication',
    metaRight: 'PubMed',
    imageSrc: '/gallery/paper2.png',
    imageAlt: 'Publication screenshot',
    mediaHeight: 210,
    action: { kind: 'external', href: 'https://pubmed.ncbi.nlm.nih.gov/37775817/' },
  },
]

const details: PortfolioDetail[] = [
  {
    id: 'beryl',
    title: 'Beryl',
    meta: 'Personal project · 2024–2025',
    summary:
      'A calendar-first stopwatch tracker that makes time logging feel like a daily workflow: quick starts, laps, recurrence, and persistence.',
    bullets: [
      'Calendar-first home: pick a day → see all timers for that date.',
      'Stopwatch UX: start/stop, laps with editable labels, freeze/read-only mode.',
      'Recurrence/pinning: one timer can appear across multiple dates with range rules.',
      'Persistence via SQLite + Prisma; state survives refreshes.',
      'Designed for speed: minimal clicks, legible structure, predictable interactions.',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/edrlu/beryl' }],
    images: [
      { src: '/gallery/beryl-demo.png', alt: 'Beryl UI overview' },
      { src: '/gallery/beryl-analytics.png', alt: 'Beryl analytics' },
    ],
  },
  {
    id: 'insider',
    title: 'Insider Correlation Toolkit',
    meta: 'Research tooling · 2025–2026',
    summary:
      'A research sandbox for measuring whether insider purchases correlate with forward returns, plus small backtesting experiments.',
    bullets: [
      'Forward-return features: +7d, +14d, +30d with skip rules when future data is missing.',
      'Nearest-close matching within a fixed tolerance window for filing dates.',
      'Aggregate metrics: sample size, mean/median returns, win rate, bucketed distributions.',
      'Backtest variants with slippage scenarios to stress assumptions.',
      'Built for iteration: quick reruns, clear outputs, and artifacts you can compare.',
    ],
    links: [],
    images: [
      { src: '/gallery/insider-correlation-analysis.png', alt: 'Correlation analysis plot' },
      { src: '/gallery/insider-backtest-1d.png', alt: 'Backtest results (1d slippage)' },
    ],
  },
]

export default function Portfolio() {
  return (
    <section className="contentPanel" aria-label="Portfolio">
      <div className="contentPanelGrid">
        <aside className="contentPanelLeft">
          <Link className={styles.backLink} href="/portfolio">
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
          <PortfolioClient projectCards={projectCards} researchCards={researchCards} details={details} />
        </div>
      </div>
    </section>
  )
}
