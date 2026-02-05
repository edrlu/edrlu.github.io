import Link from 'next/link'
import { blogPosts } from '@/lib/blogPosts'
import styles from './blog.module.css'

export default function Blog() {
  // Group posts by year
  const postsByYear = blogPosts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear().toString()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(post)
    return acc
  }, {} as Record<string, typeof blogPosts>)

  // Sort years in descending order
  const sortedYears = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a))

  // Format date to "Mon DD," format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).replace(' ', ' ') + ','
  }

  return (
    <section className="contentPanel" aria-label="Blog">
      <div className="contentPanelGrid">
        <aside className="contentPanelLeft">
          <Link className={styles.backLink} href="/">
            ← Back
          </Link>
          <h1 className="contentPanelTitle">Blog</h1>
        </aside>

        <div className="contentPanelRight">
          {sortedYears.map((year) => (
            <section key={year} className={styles.section}>
              <h2 className={styles.year}>{year}</h2>

              <div className={styles.posts}>
                {postsByYear[year].map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.post}>
                    <div className={styles.postTop}>
                      <time className={styles.date}>{formatDate(post.date)}</time>
                      <span className={styles.postMeta}>{post.readTime}</span>
                    </div>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <div className={styles.postBottom}>
                      <span className={styles.postCategory}>{post.category}</span>
                      <span className={styles.postArrow} aria-hidden="true">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
