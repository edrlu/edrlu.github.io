import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Edward Lu</h1>
          <p className={styles.subtitle}>Statistics & Data Science | UC Berkeley</p>
          <p className={styles.intro}>
            Exploring the intersection of mathematics, machine learning, and data-driven insights.
            Passionate about building robust statistical models and uncovering patterns in complex systems.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/portfolio" className={styles.primaryButton}>
              View Portfolio
            </Link>
            <Link href="/blog" className={styles.secondaryButton}>
              Read Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className={styles.featured}>
        <h2 className={styles.sectionTitle}>Featured Work</h2>
        <div className={styles.projectGrid}>
          <div className={styles.projectCard}>
            <div className={styles.projectImagePlaceholder}>
              <img src="/images/research_1.png" alt="Research" className={styles.projectImg} />
            </div>
            <h3 className={styles.projectTitle}>Custom Email Platform</h3>
            <p className={styles.projectDescription}>
              Built a comprehensive email infrastructure with Python, implementing SMTP protocols
              and custom routing logic for improved delivery rates.
            </p>
            <div className={styles.tags}>
              <span className={styles.tag}>Python</span>
              <span className={styles.tag}>SMTP</span>
              <span className={styles.tag}>Infrastructure</span>
            </div>
          </div>

          <div className={styles.projectCard}>
            <div className={styles.projectImagePlaceholder}>
              <img src="/images/train_graphs.png" alt="ML Training" className={styles.projectImg} />
            </div>
            <h3 className={styles.projectTitle}>Machine Learning Research</h3>
            <p className={styles.projectDescription}>
              Deep dive into neural network architectures and optimization techniques,
              with focus on training efficiency and model interpretability.
            </p>
            <div className={styles.tags}>
              <span className={styles.tag}>PyTorch</span>
              <span className={styles.tag}>Deep Learning</span>
              <span className={styles.tag}>Research</span>
            </div>
          </div>

          <div className={styles.projectCard}>
            <div className={styles.projectImagePlaceholder}>
              <img src="/images/research_full.png" alt="Statistical Analysis" className={styles.projectImg} />
            </div>
            <h3 className={styles.projectTitle}>Statistical Analysis</h3>
            <p className={styles.projectDescription}>
              Advanced statistical modeling and hypothesis testing for complex datasets,
              uncovering insights through rigorous mathematical frameworks.
            </p>
            <div className={styles.tags}>
              <span className={styles.tag}>R</span>
              <span className={styles.tag}>Statistics</span>
              <span className={styles.tag}>Analysis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className={styles.blog}>
        <h2 className={styles.sectionTitle}>Recent Writing</h2>
        <div className={styles.blogGrid}>
          <Link href="/blog/entropy" className={styles.blogCard}>
            <div className={styles.blogMeta}>
              <span className={styles.blogCategory}>Machine Learning Math</span>
              <span className={styles.blogDot}>·</span>
              <span className={styles.blogRead}>8 min read</span>
            </div>
            <h3 className={styles.blogTitle}>Cross Entropy: A Brief Mathematical Breakdown</h3>
            <p className={styles.blogExcerpt}>
              An in-depth exploration of cross entropy loss functions, their mathematical foundations,
              and why they're fundamental to modern machine learning optimization.
            </p>
          </Link>
        </div>
        <Link href="/blog" className={styles.viewAllBlog}>
          View all posts →
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© 2026 Edward Lu. All rights reserved.</p>
          <div className={styles.socialLinks}>
            <a
              href="https://www.linkedin.com/in/edward-lu-a68aa724b/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/edrlu"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
