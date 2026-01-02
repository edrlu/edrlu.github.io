import bcrypt from 'bcryptjs'

export const verifyPassword = (password: string): boolean => {
  const hash = process.env.NEXT_PUBLIC_PORTFOLIO_PASSWORD_HASH

  if (!hash) {
    console.error('Password hash not configured')
    return false
  }

  try {
    return bcrypt.compareSync(password, hash)
  } catch (error) {
    console.error('Password verification failed:', error)
    return false
  }
}

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem('portfolio_authenticated') === 'true'
}

export const setAuthenticated = (value: boolean): void => {
  if (typeof window === 'undefined') return
  if (value) {
    sessionStorage.setItem('portfolio_authenticated', 'true')
  } else {
    sessionStorage.removeItem('portfolio_authenticated')
  }
}
