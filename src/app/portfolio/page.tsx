import Link from 'next/link'
import styles from './portfolio.module.css'

const projects = [
  {
    title: 'Options Sentiment Agent',
    description:
      'Deep learning model using Stochastic-depth Residual Bi-GRU to predict optimal options trading opportunities from market data and sentiment analysis. Applied advanced training techniques including label smoothing, focal loss, and Stochastic Weight Averaging for robust convergence on imbalanced financial datasets.',
    tech: ['PyTorch', 'Python', 'Deep Learning', 'Bi-GRU', 'Sentiment Analysis'],
    link: 'https://github.com/edrlu',
    image: '/images/train_graphs.png',
  },
  {
    title: 'Custom Mail Intelligence Platform',
    description:
      'Intelligent email management system integrating Google OAuth 2.0, Gemini API, and Ollama for natural language processing. Automatically categorizes emails with 95% accuracy, provides smart summarization and priority scoring. Processes over 300 emails per minute with Next.js frontend and FastAPI backend.',
    tech: ['FastAPI', 'Next.js', 'Google OAuth 2.0', 'Gemini API', 'Ollama', 'NLP'],
    link: 'https://github.com/edrlu/gmail-organizer',
    image: '/images/custom_mail_platform.png',
  },
  {
    title: 'Biomedical Research',
    description:
      'Data analytics and statistical analysis for colorectal cancer resistance and mesothelial cell damage research. Processed genomic datasets, conducted bioinformatics analysis on RNA sequencing data. Contributed to 2 peer-reviewed publications in Clinical Cancer Research and Journal of Translational Medicine.',
    tech: ['Python', 'Pandas', 'Bioinformatics', 'RNA Sequencing', 'Statistical Analysis'],
    link: 'https://github.com/edrlu',
    image: '/images/research_full.png',
  },
]

export default function Portfolio() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back
        </Link>
        <h1 className={styles.title}>Edward Lu</h1>
        <p className={styles.subtitle}>Statistics & Data Science · UC Berkeley</p>
        <p className={styles.bio}>
          Third-year student with research experience in biomedical data analytics. Research
          Assistant contributing to peer-reviewed publications. Interested in deep learning,
          stochastic processes, and full-stack development.
        </p>

        <div className={styles.links}>
          <a
            href="https://github.com/edrlu"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/edward-lu-a68aa724b/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            LinkedIn
          </a>
          <Link href="/blog" className={styles.link}>
            Blog
          </Link>
        </div>
      </header>

      <section className={styles.projects}>
        <h2 className={styles.sectionTitle}>Selected Projects</h2>

        {projects.map((project, index) => (
          <article key={index} className={styles.project}>
            <div className={styles.projectContent}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>

              <div className={styles.techStack}>
                {project.tech.map((tech, i) => (
                  <span key={i} className={styles.tech}>
                    {tech}
                  </span>
                ))}
              </div>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectLink}
              >
                View Project →
              </a>
            </div>

            {project.image && (
              <div className={styles.projectImage}>
                <img src={project.image} alt={project.title} />
              </div>
            )}
          </article>
        ))}
      </section>

      <footer className={styles.footer}>
        <p>© 2026 Edward Lu</p>
      </footer>
    </div>
  )
}
