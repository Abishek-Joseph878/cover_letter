import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span>📝</span> Cover Letter AI
        </div>
        <nav className={styles.nav}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer" className={styles.navLink}>Docs</a>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.badge}>Powered by Google Gemini</div>
          <h1 className={styles.title}>
            Land Your Dream Job with <span className={styles.gradientText}>Tailored Cover Letters</span>
          </h1>
          <p className={styles.subtitle}>
            Instantly match your resume with any job description. Generate ATS-optimized, high-conversion cover letters in seconds using advanced AI.
          </p>
          <div className={styles.actions}>
            <button className={styles.primaryButton}>
              Create Your Cover Letter
              <span className={styles.arrow}>→</span>
            </button>
            <button className={styles.secondaryButton}>View Templates</button>
          </div>
        </section>

        <section id="features" className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔍</div>
            <h3>ATS Optimization</h3>
            <p>Scans job descriptions for key qualifications and integrates relevant keywords to bypass automated screeners.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎭</div>
            <h3>Tone & Style Matching</h3>
            <p>Customize the voice from highly professional to enthusiastic, adapting perfectly to any company culture.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📄</div>
            <h3>Resume Parsing</h3>
            <p>Seamlessly extracts achievements, skills, and projects from your resume to find the best match for the role.</p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Cover Letter AI. Crafted for job seekers worldwide.</p>
      </footer>
    </div>
  );
}
