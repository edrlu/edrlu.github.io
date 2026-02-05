'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

type Theme = 'light' | 'dark'

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
          <span className={opt.value === 'light' ? 'themeIcon themeIconLight' : 'themeIcon themeIconDark'}>
            <Image
              src="/images/crane.png"
              alt=""
              width={16}
              height={16}
              priority={false}
            />
          </span>
          <span className="themeLabel">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
