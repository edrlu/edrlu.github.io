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
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.homeLink}>Edward Lu</Link>
        <nav className={styles.nav}>
          <Link href="/blog" className={styles.navLinkActive}>Blog</Link>
        </nav>
      </header>

      <div className={styles.content}>
        {sortedYears.map((year) => (
          <section key={year} className={styles.section}>
            <h2 className={styles.year}>{year}</h2>

            <div className={styles.posts}>
              {postsByYear[year].map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={styles.post}
                >
                  <time className={styles.date}>{formatDate(post.date)}</time>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
