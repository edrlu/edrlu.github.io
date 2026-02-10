import Link from 'next/link'
import { getAllBlogSlugs, getBlogPost } from '@/lib/blogPosts'
import { notFound } from 'next/navigation'
import MathJaxProvider from '@/components/blog/MathJaxProvider'
import NormalAreaAnimator from '@/components/blog/NormalAreaAnimator'
import styles from './blogPost.module.css'

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }))
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

function InviteSchedulingPost() {
  return (
    <MathJaxProvider>
      <article className={styles.article}>
        <h2>Problem (restated)</h2>
        <ul>
          <li>
            Fill <strong>50</strong> interview slots from a pool of <strong>500</strong> participants.
          </li>
          <li>
            Each participant <em>i</em> has:
            <ul>
              <li>{'relevance $r_i \\in [0,1]$'}</li>
              <li>{'accept probability $a_i \\in [0,1]$'}</li>
              <li>{'response time $T_i \\sim \\mathcal{N}(\\mu_i, \\sigma_i)$ (ticks) after invite'}</li>
            </ul>
          </li>
          <li>
            You don&apos;t observe outcomes deterministically; you choose who to invite/cancel over time to maximize a
            trial-averaged score.
          </li>
        </ul>

        <h2>Deadline-aware acceptance probability</h2>
        <ul>
          <li>
            With {'$t \\in [0,500]$'}, define remaining horizon {'$H = 500 - t$'}.
          </li>
          <li>
            If you invite participant <em>i</em> now, a practical proxy for “useful acceptance by the end” is:
          </li>
        </ul>
        <div className={styles.formula}>
          {'$$p_i^{(H)} = a_i \\cdot \\Phi\\!\\left(\\frac{H-\\mu_i}{\\sigma_i}\\right)$$'}
        </div>
        <ul>
          <li>
            The {'$\\Phi$'} term is the probability they even respond within the remaining time.
          </li>
        </ul>

        <h2>Risk-aware counting (avoid running out of time)</h2>
        <ul>
          <li>
            Treat each invite as an (approx.) independent Bernoulli with probability {'$p_i$'}.
          </li>
          <li>
            Then expected acceptances and variance are:
          </li>
        </ul>
        <div className={styles.formula}>
          {'$$\\mathbb{E}[A]=\\sum_i p_i,\\qquad \\mathrm{Var}(A)=\\sum_i p_i(1-p_i)$$'}
        </div>
        <ul>
          <li>
            A conservative estimate to decide how many more invites to send is:
          </li>
        </ul>
        <div className={styles.formula}>
          {'$$A_{\\text{cons}} = \\mathbb{E}[A] - z\\sqrt{\\mathrm{Var}(A)}$$'}
        </div>
        <ul>
          <li>
            Use a larger {'$z$'} when {'$H$'} is small (fewer chances to react), which makes you oversend more aggressively.
          </li>
        </ul>

        <h2>Ranking invites (quality \u00d7 feasibility \u00d7 speed)</h2>
        <ul>
          <li>
            One simple scoring rule that tends to work well:
          </li>
        </ul>
        <div className={styles.formula}>
          {'$$\\text{score}_i \\propto r_i^{\\alpha}\\;\\cdot\\;(p_i^{(H)})^{\\beta}\\;\\cdot\\;\\frac{1}{1+\\mu_i+c\\sigma_i}$$'}
        </div>
        <ul>
          <li>
            {'$\\alpha>1$'} emphasizes relevance; {'$\\beta\\approx 1$'} avoids spamming low-probability invites.
          </li>
          <li>
            The speed term penalizes slow/uncertain responders so you fill earlier.
          </li>
        </ul>

        <h2>Improved baseline code (Python)</h2>
        <ul>
          <li>Estimates pending acceptances within the remaining horizon (not just “sometime after now”).</li>
          <li>Uses {'$p_i^{(H)}$'} for unsent participants so invites are deadline-aware.</li>
          <li>Keeps cancellation minimal (only if you already exceeded 50 acceptances).</li>
        </ul>

        <pre className={styles.code}>
          <code>{`import math

def normal_cdf(x, mean, std):
    if std <= 1e-9:
        return 1.0 if x >= mean else 0.0
    z = (x - mean) / (std * math.sqrt(2.0))
    return 0.5 * (1.0 + math.erf(z))

def clamp01(x):
    if x <= 0.0:
        return 0.0
    if x >= 1.0:
        return 1.0
    return x

def decide(state):
    t = state.time
    H = 500 - t
    target = state.target_interviews  # always 50

    accepted = state.accepted
    sent_at = state.sent_at
    participants = state.participants

    to_send = []
    to_cancel = []

    n_acc = len(accepted)
    if n_acc >= target:
        # If overshot, cancel lowest relevance among accepted (rare if you oversend sanely).
        if n_acc > target:
            acc = [p for p in participants if p.id in accepted]
            acc.sort(key=lambda p: p.relevance)
            to_cancel = [p.id for p in acc[: n_acc - target]]
        return {"toSend": to_send, "toCancel": to_cancel}

    # Pending invites: expected acceptances that can still arrive within the remaining horizon.
    exp_pending = 0.0
    var_pending = 0.0
    for p in participants:
        if p.id in sent_at and p.id not in accepted:
            elapsed = t - sent_at[p.id]
            p_open = clamp01(
                normal_cdf(elapsed + H, p.open_time_mean, p.open_time_std)
                - normal_cdf(elapsed, p.open_time_mean, p.open_time_std)
            )
            p_eff = p.accept_prob * p_open
            exp_pending += p_eff
            var_pending += p_eff * (1.0 - p_eff)

    # Conservative pending accepts: increase z as time runs out (send more aggressively late).
    if var_pending > 1e-9:
        z = 0.25 if H > 260 else 0.55 if H > 160 else 0.85 if H > 80 else 1.20
        cons_pending = max(0.0, exp_pending - z * math.sqrt(var_pending))
    else:
        cons_pending = exp_pending

    need = target - n_acc - cons_pending
    if need <= 0.25 or H <= 0:
        return {"toSend": to_send, "toCancel": to_cancel}

    # Rank unsent candidates by relevance * deadline-feasible accept prob * speed.
    ranked = []
    for p in participants:
        if p.id in sent_at:
            continue
        p_open = clamp01(normal_cdf(H, p.open_time_mean, p.open_time_std))
        p_eff = p.accept_prob * p_open
        if p_eff <= 1e-4:
            continue

        speed = 1.0 / (1.0 + p.open_time_mean + 0.6 * p.open_time_std)
        score = (p.relevance ** 1.7) * (p_eff ** 0.9) * speed
        ranked.append((score, p_eff, p.id))

    if not ranked:
        return {"toSend": to_send, "toCancel": to_cancel}

    ranked.sort(reverse=True)

    # Convert needed acceptances into a batch size using avg effective p for top candidates.
    top = ranked[: min(len(ranked), 80)]
    avg_p = sum(p_eff for _, p_eff, _ in top) / len(top)

    cushion = 0.45 if H > 260 else 0.80 if H > 160 else 1.15 if H > 80 else 1.55
    want_accepts = need + cushion

    n_send = int(math.ceil(want_accepts / max(0.02, avg_p)))
    max_batch = 28 if t < 30 else 18 if t < 120 else 12 if t < 260 else 8
    n_send = max(1, min(n_send, len(ranked), max_batch))

    to_send = [pid for _, _, pid in ranked[:n_send]]
    return {"toSend": to_send, "toCancel": to_cancel}`}</code>
        </pre>

        <h2>Knobs to tune</h2>
        <ul>
          <li>
            Underfilling late: increase the late-stage {'$z$'} and the cushion.
          </li>
          <li>
            Overfilling / cancellations: decrease the late-stage {'$z$'} and the cushion, or reduce oversend batch caps.
          </li>
          <li>
            Too slow / low relevance: increase {'$\\alpha$'}; too risky: increase the speed penalty (the {'$c\\sigma_i$'} term).
          </li>
        </ul>
      </article>
    </MathJaxProvider>
  )
}

function EntropyPost() {
  return (
    <MathJaxProvider>
      <article className={styles.article}>
        <h2>Introduction</h2>
        <p>
          Cross entropy is a fundamental concept in machine learning, particularly in classification tasks. It serves
          as a loss function that measures the difference between two probability distributions.
        </p>

        <h2>Mathematical Foundation</h2>
        <p>
          For a discrete probability distribution, the cross entropy between a true distribution $p$ and an estimated
          distribution $q$ is defined as:
        </p>
        <div className={styles.formula}>{'$$H(p, q) = -\\sum_x p(x) \\log q(x)$$'}</div>

        <h2>In Machine Learning</h2>
        <p>
          In the context of neural networks and classification, cross entropy loss is used to optimize the
          model&apos;s predictions. For binary classification:
        </p>
        <div className={styles.formula}>
          {
            '$$L = -\\frac{1}{N}\\sum_{i=1}^{N}\\left[y_i \\log(\\hat{y}_i) + (1-y_i)\\log(1-\\hat{y}_i)\\right]$$'
          }
        </div>
        <p>{'where $y_i$ is the true label and $\\hat{y}_i$ is the predicted probability.'}</p>

        <h2>Why Cross Entropy?</h2>
        <p>Cross entropy has several desirable properties for optimization:</p>
        <ul>
          <li>It&apos;s convex, making optimization easier</li>
          <li>It provides strong gradients even when predictions are far from targets</li>
          <li>It naturally handles probabilistic outputs</li>
          <li>It&apos;s differentiable everywhere (except at boundaries)</li>
        </ul>

        <h2>Relationship to KL Divergence</h2>
        <p>
          Cross entropy is closely related to Kullback-Leibler (KL) divergence. In fact, for a fixed true distribution
          $p$, minimizing cross entropy is equivalent to minimizing KL divergence:
        </p>
        <div className={styles.formula}>{'$$D_{KL}(p \\| q) = H(p, q) - H(p)$$'}</div>
        <p>
          Since $H(p)$ is constant with respect to $q$, minimizing cross entropy minimizes the KL divergence.
        </p>

        <h2>Conclusion</h2>
        <p>
          Cross entropy is more than just a loss function{'\u2014'}it&apos;s a principled way to measure distributional
          differences. Understanding its mathematical properties helps in designing better models and understanding why
          certain optimization strategies work.
        </p>
      </article>
    </MathJaxProvider>
  )
}

function NormalAreaConfidenceIntervalsPost() {
  return (
    <MathJaxProvider>
      <article className={styles.article}>
        <p>
          This post is a response to a note I left myself: make an animation for the standard normal PDF {'$\\phi$'} and
          CDF {'$\\Phi$'} that makes the area interpretation feel concrete, including how to “split the probability” to
          get a two-sided confidence interval.
        </p>

        <NormalAreaAnimator />

        <h2>Setup</h2>
        <p>{'Let $Z \\sim \\mathcal{N}(0,1)$.'}</p>
        <ul>
          <li>
            {'$\\phi(z)$'} is the <em>PDF</em> (a density, not a PMF):
            <div className={styles.formula}>{'$$\\phi(z)=\\frac{1}{\\sqrt{2\\pi}}e^{-z^2/2}$$'}</div>
          </li>
          <li>
            {'$\\Phi(z)$'} is the CDF:
            <div className={styles.formula}>{'$$\\Phi(z)=\\mathbb{P}(Z\\le z)=\\int_{-\\infty}^{z}\\phi(t)\\,dt$$'}</div>
          </li>
        </ul>

        <h2>Area as probability</h2>
        <p>
          The key picture is that probabilities for continuous random variables are <em>areas under the density</em>:
        </p>
        <div className={styles.formula}>
          {'$$\\mathbb{P}(a\\le Z\\le b)=\\int_a^b \\phi(z)\\,dz=\\Phi(b)-\\Phi(a)$$'}
        </div>
        <p>
          In “Area” mode above, the red region is the integral (the true area under the curve), while the blue bars are
          a midpoint Riemann sum approximation with {'$n$'} rectangles:
        </p>
        <div className={styles.formula}>
          {'$$\\int_a^b\\phi(z)\\,dz\\;\\approx\\;\\sum_{i=1}^{n}\\phi(z_i^*)\\,\\Delta z$$'}
        </div>
        <p>Press Play and watch the rectangles converge to the true area as {'$n$'} grows.</p>

        <h2>Splitting for a two-sided confidence interval</h2>
        <p>
          For a two-sided confidence level {'$1-\\alpha$'}, you want the <em>central</em> probability mass to be {'$1-\\alpha$'},
          leaving {'$\\alpha/2$'} in each tail:
        </p>
        <div className={styles.formula}>
          {
            '$$\\mathbb{P}(-z_{1-\\alpha/2}\\le Z\\le z_{1-\\alpha/2})=1-\\alpha,\\qquad z_{1-\\alpha/2}=\\Phi^{-1}(1-\\alpha/2)$$'
          }
        </div>

        <h2>Where does 1.96 come from?</h2>
        <p>
          The number {'$1.96$'} is a <em>quantile</em> of the standard normal. For a common choice {'$\\alpha=0.05$'} (a
          95% two-sided interval), we want {'$\\alpha/2=0.025$'} in the upper tail, which means the middle mass is
          0.95:
        </p>
        <div className={styles.formula}>{'$$\\mathbb{P}(Z\\le z)=0.975\\quad\\Longleftrightarrow\\quad z=\\Phi^{-1}(0.975)$$'}</div>
        <p>
          There isn&apos;t an elementary closed-form expression for {'$\\Phi^{-1}$'}, so {'$z$'} is computed numerically
          (or read from a Z-table). Evaluating {'$\\Phi^{-1}(0.975)$'} gives:
        </p>
        <div className={styles.formula}>{'$$\\Phi^{-1}(0.975)\\approx 1.959963984\\;\\approx\\;1.96$$'}</div>
        <p>
          (In the animation above, the {'$z$'} value is found by numerically inverting {'$\\Phi$'} via a simple bisection
          search. Try “Quantile” mode and set {'$p=0.975$'} to see {'$z\\approx 1.96$'} appear.)
        </p>
        <p>
          More generally, when someone writes something like {'$z_{1-\\alpha/2}$'}, it means: pick{' '}
          {'$p=1-\\alpha/2$'} and take {'$z=\\Phi^{-1}(p)$'}. In the widget, you can either adjust confidence (CI mode)
          or adjust {'$p$'} directly (Quantile mode) and watch the cutoff move.
        </p>
        <p>
          In “Confidence Interval” mode, the shaded center region is {'$1-\\alpha$'} and the faint tails represent {'$\\alpha/2$'} on
          each side.
        </p>

        <h2>Back to a general normal</h2>
        <p>
          If {'$X\\sim \\mathcal{N}(\\mu,\\sigma^2)$'}, standardize with {'$Z=(X-\\mu)/\\sigma$'} and reuse the same picture:
        </p>
        <div className={styles.formula}>
          {'$$\\mathbb{P}(\\mu-z\\sigma\\le X\\le \\mu+z\\sigma)=\\mathbb{P}(-z\\le Z\\le z)=1-\\alpha$$'}
        </div>
      </article>
    </MathJaxProvider>
  )
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const content =
    slug === 'normal-area-confidence-intervals' ? (
      <NormalAreaConfidenceIntervalsPost />
    ) : slug === 'invite-scheduling' ? (
      <InviteSchedulingPost />
    ) : slug === 'entropy' ? (
      <EntropyPost />
    ) : (
      <p>Blog post content not found.</p>
    )

  return (
    <section className="contentPanel" aria-label={post.title}>
      <div className="contentPanelGrid">
        <aside className="contentPanelLeft">
          <Link href="/blog" className={styles.backLink}>
            {'\u2190'} Back
          </Link>
          <h1 className="contentPanelTitle">Blog</h1>
          <div className={styles.sideMeta}>
            <div className={styles.sideTitle}>{post.title}</div>
            <div className={styles.sideLine}>
              <time>{post.date}</time>
              <span aria-hidden="true"> {'\u00B7'} </span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </aside>

        <div className={`contentPanelRight ${styles.right}`}>
          <div className={styles.inner}>
            <div className={styles.header}>
              <h2 className={styles.title}>{post.title}</h2>
              <p className={styles.excerpt}>{post.excerpt}</p>
            </div>
            <div className={styles.content}>{content}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
