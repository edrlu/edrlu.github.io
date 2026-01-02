import Link from 'next/link'
import { blogPosts } from '@/lib/blogPosts'
import styles from './blog.module.css'

export default function Blog() {
  // Group posts by category
  const postsByCategory = blogPosts.reduce((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = []
    }
    acc[post.category].push(post)
    return acc
  }, {} as Record<string, typeof blogPosts>)

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backButton}>
        ← Back to Home
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>Research Blog Collection</h1>
        <p className={styles.subtitle}>
          Technical writing on machine learning, statistics, and data science
        </p>
      </header>

      <div className={styles.content}>
        {Object.entries(postsByCategory).map(([category, posts]) => (
          <section key={category} className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{category}</h2>
            </div>

            <div className={styles.postsGrid}>
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={styles.postCard}
                >
                  <div className={styles.postMeta}>
                    <span className={styles.postDate}>{post.date}</span>
                    <span className={styles.postDot}>·</span>
                    <span className={styles.postRead}>{post.readTime}</span>
                  </div>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
