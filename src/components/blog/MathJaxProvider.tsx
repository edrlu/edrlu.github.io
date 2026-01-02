'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: () => Promise<void>
      startup?: {
        promise?: Promise<void>
      }
    }
  }
}

interface MathJaxProviderProps {
  children: React.ReactNode
}

export default function MathJaxProvider({ children }: MathJaxProviderProps) {
  useEffect(() => {
    // Load MathJax script if not already loaded
    if (!window.MathJax) {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
      script.async = true
      script.id = 'MathJax-script'

      script.onload = () => {
        // Configure MathJax after it loads
        window.MathJax = {
          ...window.MathJax,
          startup: {
            ...window.MathJax?.startup,
            promise: window.MathJax?.startup?.promise?.then(() => {
              // Typeset the page once MathJax is ready
              window.MathJax?.typesetPromise?.()
            }),
          },
        }
      }

      document.head.appendChild(script)
    } else {
      // If MathJax is already loaded, just typeset the content
      window.MathJax.typesetPromise?.()
    }
  }, [])

  // Re-typeset when content changes
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise?.()
    }
  }, [children])

  return <>{children}</>
}
