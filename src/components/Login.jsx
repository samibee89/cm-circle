import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import InstallBanner from './InstallBanner'
import './Login.css'

export default function Login() {
  const [mode, setMode] = useState('signIn') // 'signIn' | 'signUp'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    const { error } =
      mode === 'signUp'
        ? await supabase.auth.signUp({
            email,
            password,
            options: { data: { display_name: displayName } },
          })
        : await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    if (mode === 'signUp') {
      setMessage('Check your email to confirm your account, then sign in.')
    }
  }

  return (
    <div className="login-screen">
      <form onSubmit={handleSubmit} className="login-form">
        <p className="login-label">CM Circle</p>
        <h1 className="login-heading gradient-text">
          {mode === 'signUp' ? 'Create your account' : 'Welcome back'}
        </h1>

        {mode === 'signUp' && (
          <input
            type="text"
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {error && <p className="login-error">{error}</p>}
        {message && <p className="login-message">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Please wait…' : mode === 'signUp' ? 'Sign up' : 'Sign in'}
        </button>

        <button
          type="button"
          className="login-toggle"
          onClick={() => setMode(mode === 'signUp' ? 'signIn' : 'signUp')}
        >
          {mode === 'signUp'
            ? 'Already have an account? Sign in'
            : "Don't have an account? Sign up"}
        </button>
      </form>

      <InstallBanner />
    </div>
  )
}
