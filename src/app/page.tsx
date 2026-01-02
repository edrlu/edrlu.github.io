import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.name}>Edward Lu</h1>
        <p className={styles.location}>Berkeley, California</p>

        <nav className={styles.nav}>
          <Link href="/blog" className={styles.navLink}>Blog</Link>
          <Link href="/portfolio" className={styles.navLink}>Portfolio</Link>
          <a
            href="https://github.com/edrlu"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/edward-lu-a68aa724b/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            LinkedIn
          </a>
        </nav>
      </div>
    </main>
  )
}
