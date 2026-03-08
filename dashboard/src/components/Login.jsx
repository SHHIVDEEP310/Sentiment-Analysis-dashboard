// src/components/Login.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'

// Floating 3D shape (pure CSS/canvas-free)
function FloatingShape({ style, color, delay = 0 }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: '60px',
        height: '60px',
        background: color,
        borderRadius: '12px',
        opacity: 0.08,
        animation: `float ${3 + delay}s ease-in-out ${delay}s infinite`,
        transform: `rotate(${delay * 15}deg)`,
        boxShadow: `0 8px 32px ${color}`,
        ...style,
      }}
    />
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const containerRef = useRef()
  const navigate = useNavigate()

  // Parallax tilt on mouse move
  useEffect(() => {
    const handler = (e) => {
      const { innerWidth: W, innerHeight: H } = window
      const x = ((e.clientX / W) - 0.5) * 14
      const y = ((e.clientY / H) - 0.5) * -10
      setTilt({ x, y })
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check your credentials.')
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
      {/* 3D floating background shapes with parallax */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${tilt.x * 0.4}px, ${tilt.y * 0.4}px)`,
          transition: 'transform 0.1s ease-out',
          pointerEvents: 'none',
        }}
      >
        <FloatingShape style={{ top: '10%', left: '8%' }}   color="#16a34a" delay={0} />
        <FloatingShape style={{ top: '25%', right: '12%' }} color="#22c55e" delay={1} />
        <FloatingShape style={{ bottom: '20%', left: '15%' }} color="#4ade80" delay={0.5} />
        <FloatingShape style={{ bottom: '35%', right: '8%' }} color="#16a34a" delay={1.5} />
        <FloatingShape style={{ top: '60%', left: '40%' }}  color="#86efac" delay={2} />
      </div>

      {/* Grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.4,
          transform: `perspective(800px) rotateX(${tilt.y * 0.3}deg) rotateY(${tilt.x * 0.2}deg)`,
          transition: 'transform 0.1s ease-out',
          pointerEvents: 'none',
        }}
      />

      {/* Login card */}
      <div
        className="card-3d animate-fade-up"
        style={{
          width: '420px',
          padding: '48px',
          position: 'relative',
          transform: `perspective(1000px) rotateX(${tilt.y * 0.5}deg) rotateY(${tilt.x * 0.5}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Logo mark */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '24px',
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
            <span
              style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}
            >
              SentiScope
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 800,
              color: 'var(--ink)',
              lineHeight: 1.2,
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: 'var(--ink-muted)', marginTop: '8px', fontSize: '14px' }}>
            Sign in to analyse sentiment
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--ink-muted)' }}>
              Email
            </label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--ink-muted)' }}>
              Password
            </label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

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
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--ink-muted)' }}>
          No account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}