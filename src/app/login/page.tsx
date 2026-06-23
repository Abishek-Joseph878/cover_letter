"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";

function LoginForm() {
  const { user, login, signup, error, clearError, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("from") || "/dashboard";

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      router.push(redirectPath);
    }
  }, [user, router, redirectPath]);

  // Clear errors when toggling tabs
  useEffect(() => {
    clearError();
    setValidationError(null);
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email || !password) {
      setValidationError("Please fill in all fields");
      return;
    }

    if (!isLogin && !name) {
      setValidationError("Please provide your name");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      return;
    }

    if (isLogin) {
      const success = await login(email, password);
      if (success) {
        router.push(redirectPath);
        router.refresh();
      }
    } else {
      const success = await signup(name, email, password);
      if (success) {
        // Auto-login after registration
        await login(email, password);
        router.push(redirectPath);
        router.refresh();
      }
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <span>📝</span> Cover Letter AI
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${isLogin ? styles.activeTab : ""}`}
              onClick={() => setIsLogin(true)}
              type="button"
            >
              Log In
            </button>
            <button
              className={`${styles.tab} ${!isLogin ? styles.activeTab : ""}`}
              onClick={() => setIsLogin(false)}
              type="button"
            >
              Sign Up
            </button>
          </div>

          <h2 className={styles.title}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className={styles.subtitle}>
            {isLogin
              ? "Access your saved cover letters and edit drafts."
              : "Sign up to start tailoring your job application letters."}
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {(error || validationError) && (
              <div className={styles.errorMessage}>
                {validationError || error}
              </div>
            )}

            {!isLogin && (
              <div className={styles.inputGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.loader}></span>
              ) : isLogin ? (
                "Log In"
              ) : (
                "Register & Start"
              )}
            </button>
          </form>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Cover Letter AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#080811", color: "#ffffff" }}>
        Loading...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
