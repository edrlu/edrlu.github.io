import Link from 'next/link'
import styles from './flybrainCartpole.module.css'

export default function FlybrainCartpole() {
  return (
    <section className={`contentPanel ${styles.page}`} aria-label="Fly Brain Replay CartPole">
      <div className={styles.top}>
        <Link className={styles.backLink} href="/portfolio">
          {'\u2190'} Back
        </Link>
      </div>

      <div className={styles.right}>
        <div className={styles.iframeWrap} aria-label="Fly Brain Replay">
          <iframe
            className={styles.iframe}
            title="Fly Brain Replay (CartPole)"
            src="/projects/flybrain-cartpole/index.html"
            loading="eager"
          />
        </div>
      </div>
    </section>
  )
}
