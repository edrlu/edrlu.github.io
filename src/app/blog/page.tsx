import Link from 'next/link'
import { blogPosts } from '@/lib/blogPosts'
import BlogIndexClient from './blogIndexClient'
import styles from './blog.module.css'

export default function BlogIndex() {
  return (
    <section className="contentPanel" aria-label="Blog">
      <div className="contentPanelGrid">
        <aside className="contentPanelLeft">
          <Link className={styles.backLink} href="/">
            {'\u2190'} Back
          </Link>
          <h1 className="contentPanelTitle">Blog</h1>
          <div className="contentPanelHint">Notes on math, systems, and product engineering.</div>
          <nav className={styles.outline} aria-label="Outline">
            <div className={styles.outlineTitle}>Browse</div>
            <a className={styles.outlineLink} href="#blog">
              Blog
            </a>
            <a className={styles.outlineLink} href="#education">
              Education
            </a>
          </nav>
        </aside>

        <div className="contentPanelRight">
          <BlogIndexClient posts={blogPosts} />
        </div>
      </div>
    </section>
  )
}
