'use client'

import { useEffect, useMemo, useState } from 'react'

type Theme = 'light' | 'dark'

const storageKey = 'theme'

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
}

function getInitialTheme(): Theme {
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
  return prefersDark ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    const next: Theme = stored === 'dark' || stored === 'light' ? stored : getInitialTheme()
    setTheme(next)
    applyTheme(next)
  }, [])

  const options = useMemo(
    () =>
      [
        { value: 'light' as const, label: 'Light' },
        { value: 'dark' as const, label: 'Dark' },
      ] satisfies Array<{ value: Theme; label: string }>,
    [],
  )

  return (
    <div className="themeToggle" role="group" aria-label="Theme">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={theme === opt.value ? 'themeBtn isSelected' : 'themeBtn'}
          onClick={() => {
            setTheme(opt.value)
            localStorage.setItem(storageKey, opt.value)
            applyTheme(opt.value)
          }}
        >
          <span className="themeBox" aria-hidden="true" />
          <span className="themeLabel">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
