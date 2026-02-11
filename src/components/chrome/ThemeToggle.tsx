'use client'

import { useEffect, useMemo, useState } from 'react'

type Theme = 'light' | 'dark' | 'paper'

const storageKey = 'theme'

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
}

function getInitialTheme(): Theme {
  return 'dark'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    const next: Theme = stored === 'dark' || stored === 'light' || stored === 'paper' ? stored : getInitialTheme()
    setTheme(next)
    applyTheme(next)
  }, [])

  const options = useMemo(
    () =>
      [
        { value: 'light' as const, label: 'Light theme', dotClass: 'themeDotLight' },
        { value: 'dark' as const, label: 'Dark theme', dotClass: 'themeDotDark' },
        { value: 'paper' as const, label: 'Parchment theme', dotClass: 'themeDotPaper' },
      ] satisfies Array<{ value: Theme; label: string; dotClass: string }>,
    [],
  )

  return (
    <div className="themeToggle" role="group" aria-label="Theme">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={theme === opt.value ? 'themeBtn isSelected' : 'themeBtn'}
          aria-label={opt.label}
          title={opt.label}
          aria-pressed={theme === opt.value}
          onClick={() => {
            setTheme(opt.value)
            localStorage.setItem(storageKey, opt.value)
            applyTheme(opt.value)
          }}
        >
          <span className={`themeDot ${opt.dotClass}`} aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
