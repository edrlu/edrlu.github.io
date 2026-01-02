import Link from 'next/link'
import { getBlogPost, getAllBlogSlugs } from '@/lib/blogPosts'
import { notFound } from 'next/navigation'
import MathJaxProvider from '@/components/blog/MathJaxProvider'
import styles from './blogPost.module.css'

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }))
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  // For now, we'll render the entropy post content inline
  // In a full implementation, this would come from MDX or markdown files
  const renderContent = () => {
    if (slug === 'entropy') {
      return (
        <MathJaxProvider>
          <article className={styles.article}>
            <h2>Introduction</h2>
            <p>
              Cross entropy is a fundamental concept in machine learning, particularly in
              classification tasks. It serves as a loss function that measures the difference
              between two probability distributions.
            </p>

            <h2>Mathematical Foundation</h2>
            <p>
              For a discrete probability distribution, the cross entropy between a true distribution
              $p$ and an estimated distribution $q$ is defined as:
            </p>
            <div className={styles.formula}>
              $$H(p, q) = -\sum_x p(x) \log q(x)$$
            </div>

            <h2>In Machine Learning</h2>
            <p>
              In the context of neural networks and classification, cross entropy loss is used to
              optimize the model&apos;s predictions. For binary classification:
            </p>
            <div className={styles.formula}>
              $$L = -\frac{"{1}"}{"{N}"}\sum_{"{i=1}"}^{"{N}"} [y_i \log(\hat{"{y}"}_i) + (1-y_i) \log(1-\hat{"{y}"}_i)]$$
            </div>
            <p>
              where $y_i$ is the true label and $\hat{"{y}"}_i$ is the predicted probability.
            </p>

            <h2>Why Cross Entropy?</h2>
            <p>
              Cross entropy has several desirable properties for optimization:
            </p>
            <ul>
              <li>It&apos;s convex, making optimization easier</li>
              <li>It provides strong gradients even when predictions are far from targets</li>
              <li>It naturally handles probabilistic outputs</li>
              <li>It&apos;s differentiable everywhere (except at boundaries)</li>
            </ul>

            <h2>Relationship to KL Divergence</h2>
            <p>
              Cross entropy is closely related to Kullback-Leibler (KL) divergence. In fact, for a
              fixed true distribution $p$, minimizing cross entropy is equivalent to minimizing KL
              divergence:
            </p>
            <div className={styles.formula}>
              $$D_{"{KL}"}(p \| q) = H(p, q) - H(p)$$
            </div>
            <p>
              Since $H(p)$ is constant with respect to $q$, minimizing cross entropy minimizes the
              KL divergence.
            </p>

            <h2>Conclusion</h2>
            <p>
              Cross entropy is more than just a loss function—it&apos;s a principled way to measure
              distributional differences. Understanding its mathematical properties helps in
              designing better models and understanding why certain optimization strategies work.
            </p>
          </article>
        </MathJaxProvider>
      )
    }

    return <p>Blog post content not found.</p>
  }

  return (
    <div className={styles.container}>
      <Link href="/blog" className={styles.backButton}>
        ← Back to Blog
      </Link>

      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.category}>{post.category}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.date}>{post.date}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.readTime}>{post.readTime}</span>
        </div>
        <h1 className={styles.title}>{post.title}</h1>
      </header>

      <div className={styles.content}>{renderContent()}</div>
    </div>
  )
}
