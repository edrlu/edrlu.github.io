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
