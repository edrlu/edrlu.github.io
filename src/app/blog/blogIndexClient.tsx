'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { BlogPost, EducationArea } from '@/lib/blogPosts'
import styles from './blog.module.css'

type View = 'root' | 'blog' | 'education' | 'education-statistics' | 'education-machine-learning'

function parseViewFromHash(hash: string): View {
  const h = hash.replace('#', '').trim().toLowerCase()
  if (!h) return 'root'
  if (h === 'blog') return 'blog'
  if (h === 'education') return 'education'
  if (h === 'education-statistics' || h === 'education/statistics') return 'education-statistics'
  if (h === 'education-machine-learning' || h === 'education/machine-learning') return 'education-machine-learning'
  return 'root'
}

function hashForView(view: View) {
  if (view === 'blog') return '#blog'
  if (view === 'education') return '#education'
  if (view === 'education-statistics') return '#education-statistics'
  if (view === 'education-machine-learning') return '#education-machine-learning'
  return ''
}

function labelForPost(post: BlogPost) {
  if (post.collection === 'blog') return 'Blog'
  if (post.area === 'statistics') return 'Education · Statistics'
  if (post.area === 'machine-learning') return 'Education · Machine learning'
  return 'Education'
}

function titleForView(view: View) {
  if (view === 'blog') return 'Blog'
  if (view === 'education') return 'Education'
  if (view === 'education-statistics') return 'Education · Statistics'
  if (view === 'education-machine-learning') return 'Education · Machine learning'
  return 'Categories'
}

function parentView(view: View): View {
  if (view === 'blog') return 'root'
  if (view === 'education') return 'root'
  if (view === 'education-statistics') return 'education'
  if (view === 'education-machine-learning') return 'education'
  return 'root'
}

function educationAreaLabel(area: EducationArea) {
  return area === 'statistics' ? 'Statistics' : 'Machine learning'
}

export default function BlogIndexClient({ posts }: { posts: BlogPost[] }) {
  const [view, setView] = useState<View>('root')

  useEffect(() => {
    const sync = () => setView(parseViewFromHash(window.location.hash))
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const sortedPosts = useMemo(() => {
    const copy = [...posts]
    copy.sort((a, b) => +new Date(b.date) - +new Date(a.date))
    return copy
  }, [posts])

  const blogCount = useMemo(() => sortedPosts.filter((p) => p.collection === 'blog').length, [sortedPosts])
  const eduCount = useMemo(() => sortedPosts.filter((p) => p.collection === 'education').length, [sortedPosts])
  const eduStatsCount = useMemo(
    () => sortedPosts.filter((p) => p.collection === 'education' && p.area === 'statistics').length,
    [sortedPosts],
  )
  const eduMlCount = useMemo(
    () => sortedPosts.filter((p) => p.collection === 'education' && p.area === 'machine-learning').length,
    [sortedPosts],
  )

  const filteredPosts = useMemo(() => {
    if (view === 'blog') return sortedPosts.filter((p) => p.collection === 'blog')
    if (view === 'education-statistics') return sortedPosts.filter((p) => p.collection === 'education' && p.area === 'statistics')
    if (view === 'education-machine-learning')
      return sortedPosts.filter((p) => p.collection === 'education' && p.area === 'machine-learning')
    return []
  }, [sortedPosts, view])

  const onView = (next: View) => {
    setView(next)
    window.location.hash = hashForView(next)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const onBack = () => {
    const prev = parentView(view)
    setView(prev)
    if (prev === 'root') window.history.replaceState(null, '', window.location.pathname)
    else window.location.hash = hashForView(prev)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <section className={styles.client} aria-label="Blog index">
      <div className={styles.viewBar}>
        {view !== 'root' ? (
          <button type="button" className={styles.viewBack} onClick={onBack}>
            {'\u2190'} Back
          </button>
        ) : (
          <div />
        )}
        <div className={styles.viewTitle}>{titleForView(view)}</div>
        <div className={styles.viewMeta}>
          {view === 'blog'
            ? `${blogCount} posts`
            : view === 'education'
              ? '2 tracks'
              : view === 'education-statistics'
                ? `${educationAreaLabel('statistics')} · ${eduStatsCount} posts`
                : view === 'education-machine-learning'
                  ? `${educationAreaLabel('machine-learning')} · ${eduMlCount} posts`
                  : '2 collections'}
        </div>
      </div>

      {view === 'root' ? (
        <ul className={styles.list} aria-label="Collections">
          <li className={styles.listItem}>
            <button type="button" className={styles.pick} onClick={() => onView('blog')}>
              <div className={styles.pickTop}>
                <div className={styles.pickTitle}>Blog</div>
                <div className={styles.pickMeta}>{blogCount} posts</div>
              </div>
              <div className={styles.pickSub}>Product notes, systems, and whatever I’m thinking about.</div>
            </button>
          </li>
          <li className={styles.listItem}>
            <button type="button" className={styles.pick} onClick={() => onView('education')}>
              <div className={styles.pickTop}>
                <div className={styles.pickTitle}>Education</div>
                <div className={styles.pickMeta}>{eduCount} posts</div>
              </div>
              <div className={styles.pickSub}>Interactive explanations and math-forward posts.</div>
            </button>
          </li>
        </ul>
      ) : view === 'education' ? (
        <ul className={styles.list} aria-label="Education tracks">
          <li className={styles.listItem}>
            <button type="button" className={styles.pick} onClick={() => onView('education-statistics')}>
              <div className={styles.pickTop}>
                <div className={styles.pickTitle}>Statistics</div>
                <div className={styles.pickMeta}>{eduStatsCount} posts</div>
              </div>
              <div className={styles.pickSub}>Probability, inference, and intuition builders.</div>
            </button>
          </li>
          <li className={styles.listItem}>
            <button type="button" className={styles.pick} onClick={() => onView('education-machine-learning')}>
              <div className={styles.pickTop}>
                <div className={styles.pickTitle}>Machine learning</div>
                <div className={styles.pickMeta}>{eduMlCount} posts</div>
              </div>
              <div className={styles.pickSub}>Losses, optimization, and math that shows up in practice.</div>
            </button>
          </li>
        </ul>
      ) : (
        <div className={styles.posts} aria-label="Posts">
          {filteredPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.post}>
              <div className={styles.postTop}>
                <div className={styles.postMeta}>{labelForPost(post)}</div>
                <div className={styles.postDate}>{post.date}</div>
              </div>
              <div className={styles.postTitle}>{post.title}</div>
              <div className={styles.postExcerpt}>{post.excerpt}</div>
              <div className={styles.postBottom}>
                <div>{post.readTime}</div>
                <div className={styles.postArrow} aria-hidden="true">
                  {'\u2192'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

