import Link from 'next/link'
import { blogPosts } from '@/lib/blogPosts'
import styles from './blog.module.css'

type YearGroup = { year: string; posts: typeof blogPosts }

function groupByYear(): YearGroup[] {
  const sorted = [...blogPosts].sort((a, b) => +new Date(b.date) - +new Date(a.date))
  const map = new Map<string, typeof blogPosts>()

  for (const post of sorted) {
    const year = String(new Date(post.date).getFullYear())
    const list = map.get(year) ?? []
    list.push(post)
    map.set(year, list)
  }

  return [...map.entries()].map(([year, posts]) => ({ year, posts }))
}

export default function BlogIndex() {
  const groups = groupByYear()

  return (
    <section className="contentPanel" aria-label="Blog">
      <div className="contentPanelGrid">
        <aside className="contentPanelLeft">
          <Link className={styles.backLink} href="/">
            {'\u2190'} Back
          </Link>
          <h1 className="contentPanelTitle">Blog</h1>
          <div className="contentPanelHint">Notes on math, systems, and product engineering.</div>
        </aside>

        <div className="contentPanelRight">
          <div className={styles.inner}>
            {groups.map((group) => (
              <section key={group.year} className={styles.section} aria-label={group.year}>
                <div className={styles.year}>{group.year}</div>
                <div className={styles.posts}>
                  {group.posts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.post}>
                      <div className={styles.postTop}>
                        <div className={styles.date}>{post.date}</div>
                        <div className={styles.postMeta}>{post.category}</div>
                      </div>
                      <div className={styles.postTitle}>{post.title}</div>
                      <div className={styles.postBottom}>
                        <div>{post.readTime}</div>
                        <div className={styles.postArrow} aria-hidden="true">
                          {'\u2192'}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

