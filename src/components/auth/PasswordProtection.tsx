'use client'

import { useState, useEffect } from 'react'
import { verifyPassword, isAuthenticated, setAuthenticated } from '@/lib/auth'
import styles from './PasswordProtection.module.css'

interface PasswordProtectionProps {
  children: React.ReactNode
}

export default function PasswordProtection({ children }: PasswordProtectionProps) {
  const [authenticated, setAuthenticatedState] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if already authenticated
    setAuthenticatedState(isAuthenticated())
    setLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!password) {
      setError('Please enter a password')
      return
    }

    const isValid = verifyPassword(password)

    if (isValid) {
      setAuthenticated(true)
      setAuthenticatedState(true)
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading...</p>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2 className={styles.title}>Portfolio Access</h2>
            <p className={styles.subtitle}>This content is password protected</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Enter password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.toggleButton}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <button type="submit" className={styles.submitButton}>
              Access Portfolio
            </button>
          </form>

          <p className={styles.note}>
            Access is restricted to protect privacy. Session expires when you close the tab.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
