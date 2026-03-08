// src/components/Register.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    setError('')
    try {
      await register(email, password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      />

      <div
        className="card-3d animate-fade-up"
        style={{ width: '420px', padding: '48px', position: 'relative' }}
      >
        <div style={{ marginBottom: '32px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '24px',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                background: 'var(--ink)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: '#22c55e', fontSize: '18px', fontWeight: 800 }}>S</span>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>
              SentiScope
            </span>
          </Link>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            Create account
          </h1>
          <p style={{ color: 'var(--ink-muted)', marginTop: '8px', fontSize: '14px' }}>
            Start analysing sentiment in seconds
          </p>
        </div>

        {success ? (
          <div
            style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              color: '#16a34a',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>✓</div>
            <strong>Account created!</strong>
            <p style={{ fontSize: '13px', marginTop: '4px', color: 'var(--ink-muted)' }}>
              Redirecting to login…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {[
              { label: 'Email', type: 'email', val: email, set: setEmail, ph: 'you@example.com' },
              { label: 'Password', type: 'password', val: password, set: setPassword, ph: '••••••••' },
              { label: 'Confirm Password', type: 'password', val: confirm, set: setConfirm, ph: '••••••••' },
            ].map(({ label, type, val, set, ph }) => (
              <div key={label} style={{ marginBottom: '16px' }}>
                <label
                  style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--ink-muted)' }}
                >
                  {label}
                </label>
                <input
                  className="input"
                  type={type}
                  placeholder={ph}
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  required
                />
              </div>
            ))}

            {error && (
              <div
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#dc2626',
                  fontSize: '13px',
                  marginBottom: '16px',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-accent"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '8px' }}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--ink-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}