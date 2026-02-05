import Image from 'next/image'
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
    imageSize: { width: 1678, height: 584 },
  },
  {
    title: 'Custom Mail Intelligence Platform',
    description:
      'Intelligent email management system integrating Google OAuth 2.0, Gemini API, and Ollama for natural language processing. Automatically categorizes emails with 95% accuracy, provides smart summarization and priority scoring. Processes over 300 emails per minute with Next.js frontend and FastAPI backend.',
    tech: ['FastAPI', 'Next.js', 'Google OAuth 2.0', 'Gemini API', 'Ollama', 'NLP'],
    link: 'https://github.com/edrlu/gmail-organizer',
    image: '/images/custom_mail_platform.png',
    imageSize: { width: 1592, height: 508 },
  },
  {
    title: 'Biomedical Research',
    description:
      'Data analytics and statistical analysis for colorectal cancer resistance and mesothelial cell damage research. Processed genomic datasets, conducted bioinformatics analysis on RNA sequencing data. Contributed to 2 peer-reviewed publications in Clinical Cancer Research and Journal of Translational Medicine.',
    tech: ['Python', 'Pandas', 'Bioinformatics', 'RNA Sequencing', 'Statistical Analysis'],
    link: 'https://github.com/edrlu',
    image: '/images/research_full.png',
    imageSize: { width: 839, height: 574 },
  },
]

export default function Portfolio() {
  return (
    <section className="contentPanel" aria-label="Portfolio">
      <div className="contentPanelGrid">
        <aside className="contentPanelLeft">
          <Link className={styles.backLink} href="/">
            ← Back
          </Link>
          <h1 className="contentPanelTitle">Portfolio</h1>
        </aside>

        <div className="contentPanelRight">
          <div className={styles.header}>
            <h2 className={styles.title}>Selected projects</h2>
            <p className={styles.subtitle}>
              Deep learning, NLP, and full‑stack systems — focused on clarity, performance, and measurable impact.
            </p>
          </div>

          <div className={styles.projects} aria-label="Projects">
            {projects.map((project) => (
              <article key={project.title} className={styles.project}>
                <div className={styles.projectTop}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                    View ↗
                  </a>
                </div>

                <p className={styles.projectDescription}>{project.description}</p>

                <div className={styles.techStack} aria-label="Tech stack">
                  {project.tech.map((tech) => (
                    <span key={tech} className={styles.tech}>
                      {tech}
                    </span>
                  ))}
                </div>

                {project.image && (
                  <div className={styles.projectImage}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={project.imageSize.width}
                      height={project.imageSize.height}
                      sizes="(max-width: 820px) 100vw, 860px"
                    />
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
