export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  hasMath?: boolean
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'normal-area-confidence-intervals',
    title: 'From \u03c6 to \u03a6: Area Under the Curve and Confidence Intervals',
    excerpt:
      'An interactive visualization for the standard normal PDF \u03c6 and CDF \u03a6: see why P(a \u2264 Z \u2264 b) is an area, how midpoint sums converge to an integral, and how the same picture yields two-sided confidence intervals.',
    date: 'Feb 10, 2026',
    readTime: '7 min read',
    category: 'Statistics',
    hasMath: true,
  },
  {
    slug: 'invite-scheduling',
    title: 'Invite Scheduling: Filling 50 Slots Under Uncertainty',
    excerpt:
      'A practical way to think about an interview-invite challenge as risk-aware optimization: expected acceptances, response-time distributions, and a simple policy that balances speed, quality, and cancellations.',
    date: 'Oct 30, 2025',
    readTime: '10 min read',
    category: 'Optimization',
    hasMath: true,
  },
  {
    slug: 'entropy',
    title: 'Cross Entropy: A Brief Mathematical Breakdown',
    excerpt:
      'An in-depth exploration of cross entropy loss functions, their mathematical foundations, and why they\'re fundamental to modern machine learning optimization.',
    date: 'Mar 15, 2025',
    readTime: '8 min read',
    category: 'Machine Learning Math',
    hasMath: true,
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug)
}
