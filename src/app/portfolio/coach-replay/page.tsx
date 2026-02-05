import Link from 'next/link'
import styles from './coachReplay.module.css'

export default function CoachReplay() {
  return (
    <section className="contentPanel" aria-label="Coach replay visualization">
      <div className="contentPanelGrid">
        <aside className="contentPanelLeft">
          <Link className={styles.backLink} href="/portfolio">
            {'\u2190'} Back
          </Link>
          <h1 className="contentPanelTitle">Coach</h1>
          <div className="contentPanelHint">Interactive replay visualization.</div>
        </aside>

        <div className={`contentPanelRight ${styles.right}`}>
          <div className={styles.iframeWrap} aria-label="Replay">
            <iframe
              className={styles.iframe}
              title="Replay NA1_5482470730"
              src="/replays/replay_NA1_5482470730.html"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

