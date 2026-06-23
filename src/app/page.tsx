"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function Home() {
  const { user, logout, loading } = useAuth();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <span>📝</span> Cover Letter AI
        </Link>
        <nav className={styles.nav}>
          <a href="#features" className={styles.navLink}>
            Features
          </a>
          {user ? (
            <>
              <Link href="/dashboard" className={styles.navLink}>
                Workspace
              </Link>
              <button onClick={logout} className={styles.navLink} style={{ background: "transparent", border: "none", cursor: "pointer", font: "inherit" }}>
                Log Out ({user.name})
              </button>
            </>
          ) : (
            <Link href="/login" className={styles.navLink}>
              Log In
            </Link>
          )}
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
            {loading ? (
              <button className={styles.primaryButton} disabled>
                Loading...
              </button>
            ) : user ? (
              <Link href="/dashboard" className={styles.primaryButton}>
                Go to Workspace
                <span className={styles.arrow}>→</span>
              </Link>
            ) : (
              <Link href="/login" className={styles.primaryButton}>
                Create Your Cover Letter
                <span className={styles.arrow}>→</span>
              </Link>
            )}
            <a href="#features" className={styles.secondaryButton}>
              Learn More
            </a>
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
