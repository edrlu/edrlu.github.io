'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import styles from './portfolio.module.css'

type CardAction =
  | { kind: 'detail'; id: string }
  | { kind: 'internal'; href: string }
  | { kind: 'external'; href: string }

export type PortfolioCardData = {
  title: string
  subtitle: string
  metaLeft: string
  metaRight: string
  imageSrc?: string
  imageAlt?: string
  mediaHeight?: number
  action: CardAction
}

export type PortfolioDetail = {
  id: string
  title: string
  meta: string
  summary: string
  bullets: string[]
  links: Array<{ label: string; href: string }>
  images: Array<{ src: string; alt: string }>
}

function Card({ card, onSelect }: { card: PortfolioCardData; onSelect: (id: string) => void }) {
  const mediaStyle = useMemo(
    () =>
      ({
        ['--media-h' as string]: `${Math.max(180, card.mediaHeight ?? 260)}px`,
      }) as CSSProperties,
    [card.mediaHeight],
  )

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

  if (card.action.kind === 'detail') {
    const detailId = card.action.id
    return (
      <button type="button" className={`${styles.card} ${styles.cardBtn}`} onClick={() => onSelect(detailId)}>
        {inner}
      </button>
    )
  }

  if (card.action.kind === 'internal') {
    return (
      <Link className={`${styles.card} ${styles.cardLink}`} href={card.action.href}>
        {inner}
      </Link>
    )
  }

  return (
    <a className={`${styles.card} ${styles.cardLink}`} href={card.action.href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  )
}

function DetailView({
  detail,
  onBack,
}: {
  detail: PortfolioDetail
  onBack: () => void
}) {
  return (
    <section className={styles.detail} aria-label={detail.title}>
      <div className={styles.detailTop}>
        <button type="button" className={styles.detailBack} onClick={onBack}>
          {'\u2190'} Back
        </button>
        <div className={styles.detailMeta}>{detail.meta}</div>
      </div>

      <h2 className={styles.detailTitle}>{detail.title}</h2>
      <p className={styles.detailSummary}>{detail.summary}</p>

      <div className={styles.detailImages} aria-label="Images">
        {detail.images.map((img) => (
          <div key={img.src} className={styles.detailImage}>
            <Image src={img.src} alt={img.alt} fill sizes="(max-width: 820px) 100vw, 860px" style={{ objectFit: 'cover' }} />
          </div>
        ))}
      </div>

      <div className={styles.detailGrid}>
        <div className={styles.detailCol}>
          <div className={styles.detailSectionTitle}>Highlights</div>
          <ul className={styles.detailList}>
            {detail.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>

        <div className={styles.detailCol}>
          <div className={styles.detailSectionTitle}>Links</div>
          <div className={styles.detailLinks}>
            {detail.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>
                {l.label} {'\u2197'}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function PortfolioClient({
  projectCards,
  researchCards,
  details,
}: {
  projectCards: PortfolioCardData[]
  researchCards: PortfolioCardData[]
  details: PortfolioDetail[]
}) {
  const [selected, setSelected] = useState<string | null>(null)

  const detailMap = useMemo(() => new Map(details.map((d) => [d.id, d])), [details])

  useEffect(() => {
    const fromHash = window.location.hash.replace('#', '')
    if (fromHash && detailMap.has(fromHash)) {
      setSelected(fromHash)
    }
  }, [detailMap])

  const current = selected ? detailMap.get(selected) : null

  const onSelect = (id: string) => {
    setSelected(id)
    window.location.hash = id
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const onBack = () => {
    setSelected(null)
    history.replaceState(null, '', window.location.pathname)
  }

  if (current) {
    return <DetailView detail={current} onBack={onBack} />
  }

  return (
    <>
      <section id="projects" className={styles.block} aria-label="Projects">
        <div className={styles.blockTitle}>Projects</div>
        <div className={styles.cardMasonry}>
          {projectCards.map((card) => (
            <Card key={card.title} card={card} onSelect={onSelect} />
          ))}
        </div>
      </section>

      <section id="research" className={styles.block} aria-label="Research">
        <div className={styles.blockTitle}>Research</div>
        <div className={styles.cardMasonry}>
          {researchCards.map((card) => (
            <Card key={card.title} card={card} onSelect={onSelect} />
          ))}
        </div>
      </section>
    </>
  )
}
