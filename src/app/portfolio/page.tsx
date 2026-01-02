import Link from 'next/link'
import PerpetualNeuralWaves from '@/components/animations/PerpetualNeuralWaves'
import styles from './portfolio.module.css'

export default function Portfolio() {
  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h1 className={styles.name}>Edward Lu</h1>

        <PerpetualNeuralWaves size={200} gridSize={20} speed={120} />

        <p className={styles.bio}>
          UC Berkeley Statistics & Data Science 3rd year student with research experience in
          biomedical data analytics. Research Assistant contributing to peer-reviewed publications
          in Clinical Cancer Research and Journal of Translational Medicine. Interested in deep
          learning, stochastic processes, and full-stack development.
        </p>

        <p className={styles.hobbies}>
          Hobbies: electronics, rock climbing, Kaggle, strategy games.
        </p>

        <div className={styles.linksSection}>
          <a
            href="https://www.linkedin.com/in/edward-lu-a68aa724b/"
            className="linkedin-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            View my LinkedIn Profile
          </a>
          <Link href="/blog" className="linkedin-link">
            Read my Blog
          </Link>
          <Link href="/" className="linkedin-link">
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <p>Selected projects in data science, machine learning and biomedical research</p>
        </div>

        {/* Project 1: Options Sentiment Agent */}
        <div className={styles.project}>
          <h2 className={styles.projectTitle}>Options Sentiment Agent</h2>
          <p className={styles.projectDescription}>
            Developed a deep learning model using Stochastic-depth Residual Bi-GRU techniques to
            predict optimal options trading opportunities from public market data and sentiment
            analysis. Applied advanced training techniques including label smoothing, focal loss,
            and Stochastic Weight Averaging with early-stopping validation to achieve robust
            convergence on imbalanced and limited financial datasets.
          </p>

          <div className={styles.techTags}>
            <span className={styles.tag}>PyTorch</span>
            <span className={styles.tag}>Python</span>
            <span className={styles.tag}>Deep Learning</span>
            <span className={styles.tag}>Bi-GRU</span>
            <span className={styles.tag}>Sentiment Analysis</span>
            <span className={styles.tag}>Matplotlib</span>
          </div>

          <a
            href="https://github.com/edrlu"
            className="project-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            View code on GitHub
          </a>

          <div className={styles.projectImage}>
            <img
              src="/images/train_graphs.png"
              style={{ width: '100%', height: '100%', objectFit: 'fill' }}
              alt="Options Sentiment Agent"
            />
          </div>
        </div>

        {/* Project 2: Custom Mail Intelligence Platform */}
        <div className={styles.project}>
          <h2 className={styles.projectTitle}>Custom Mail Intelligence Platform</h2>
          <p className={styles.projectDescription}>
            Built an intelligent email management system that integrates Google OAuth 2.0 for secure
            Gmail access with Gemini API and Ollama for natural language processing. The platform
            automatically categorizes emails with 95% accuracy using custom categories, provides
            smart summarization and priority scoring, and features template response capabilities
            with a Next.js interface and FastAPI backend capable of processing over 300 emails per
            minute.
          </p>

          <div className={styles.techTags}>
            <span className={styles.tag}>FastAPI</span>
            <span className={styles.tag}>Next.js</span>
            <span className={styles.tag}>JavaScript</span>
            <span className={styles.tag}>Google OAuth 2.0</span>
            <span className={styles.tag}>Gemini API</span>
            <span className={styles.tag}>Ollama</span>
            <span className={styles.tag}>NLP</span>
          </div>

          <a
            href="https://github.com/edrlu/gmail-organizer"
            className="project-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            View project details
          </a>

          <div className={styles.projectImage}>
            <img
              src="/images/custom_mail_platform.png"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              alt="Custom Mail Intelligence Platform"
            />
          </div>
        </div>

        {/* Project 3: Biomedical Research */}
        <div className={styles.project}>
          <h2 className={styles.projectTitle}>
            Biomedical Research - Colorectal Cancer & Mesothelial Cell Analysis
          </h2>
          <p className={styles.projectDescription}>
            Performed data analytics and statistical analysis for colorectal cancer resistance and
            mesothelial cell damage research as Research Assistant. Processed genomic datasets using
            Python/pandas, conducted bioinformatics analysis on RNA sequencing data, and prepared
            manuscript figures. Contributed to 2 peer-reviewed publications in Clinical Cancer
            Research and Journal of Translational Medicine.
          </p>

          <div className={styles.techTags}>
            <span className={styles.tag}>Python</span>
            <span className={styles.tag}>Pandas</span>
            <span className={styles.tag}>Bioinformatics</span>
            <span className={styles.tag}>RNA Sequencing</span>
            <span className={styles.tag}>Statistical Analysis</span>
            <span className={styles.tag}>Genomics</span>
          </div>

          <a
            href="https://github.com/edrlu"
            className="project-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            View publications
          </a>

          <div className={styles.projectImageLarge}>
            <img
              src="/images/research_full.png"
              style={{ width: '100%', height: '100%', objectFit: 'fill' }}
              alt="Biomedical Research"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
