// src/components/Dashboard.jsx
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { predict, getStats, isAuthenticated } from '../services/api'
import SearchBar from './SearchBar'
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts'

const SENTIMENT_COLORS = {
  positive:   '#22c55e',
  negative:   '#ef4444',
  neutral:    '#f59e0b',
  irrelevant: '#8b5cf6',
}

// ── Three Dot Menu (Guest) ─────────────────────────────────────
function GuestDotsMenu() {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  const items = [
    { label: 'About',    action: () => navigate('/about') },
    { label: 'Login',    action: () => navigate('/login') },
    { label: 'Register', action: () => navigate('/register') },
    { label: 'Contact',  action: () => navigate('/contact') },
  ]

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.dots-menu')) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="dots-menu" style={{ position: 'relative', zIndex: 1000 }}>
      <button
        onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          padding: '10px',
          borderRadius: '12px',
          background: hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
          transition: 'background 0.2s',
        }}
      >
        {[0,1,2].map(i => (
          <span key={i} style={{
            display: 'block', width: '6px', height: '6px',
            borderRadius: '50%', background: '#ffffff',
            transition: `transform 0.3s cubic-bezier(0.34,1.56,0.64,1) ${i*0.05}s, box-shadow 0.3s`,
            transform: hovered ? `scale(1.4) translateY(${[-2,0,2][i]}px)` : 'scale(1)',
            boxShadow: hovered ? '0 0 8px rgba(255,255,255,0.8)' : 'none',
          }} />
        ))}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0,
          width: '180px', borderRadius: '14px', overflow: 'hidden',
          background: 'rgba(10,10,10,0.97)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
          animation: 'fadeUp 0.2s ease both',
          zIndex: 9999,
        }}>
          {items.map((item, i) => (
            <button key={item.label} onClick={() => { item.action(); setOpen(false) }}
              style={{
                display: 'block', width: '100%', background: 'transparent',
                border: 'none', borderBottom: i < items.length-1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                padding: '14px 20px', textAlign: 'left',
                fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600,
                color: '#ffffff', cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Three Dot Menu (User) ──────────────────────────────────────
function UserDotsMenu() {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
    setOpen(false)
  }

  const items = [
    { label: 'Profile',  action: () => navigate('/profile') },
    { label: 'History',  action: () => navigate('/history') },
    { label: 'Logout',   action: handleLogout, danger: true },
  ]

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.user-dots-menu')) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="user-dots-menu" style={{ position: 'relative', zIndex: 1000 }}>
      <button
        onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', gap: '5px',
          padding: '10px', borderRadius: '12px',
          background: hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
          transition: 'background 0.2s',
        }}
      >
        {[0,1,2].map(i => (
          <span key={i} style={{
            display: 'block', width: '7px', height: '7px',
            borderRadius: '50%', background: '#ffffff',
            transition: `transform 0.3s cubic-bezier(0.34,1.56,0.64,1) ${i*0.05}s, box-shadow 0.3s`,
            transform: hovered ? `scale(1.4) translateY(${[-2,0,2][i]}px)` : 'scale(1)',
            boxShadow: hovered ? '0 0 10px rgba(255,255,255,0.9)' : '0 0 0 1px rgba(255,255,255,0.3)',
          }} />
        ))}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: '180px', borderRadius: '14px', overflow: 'hidden',
          background: 'rgba(10,10,10,0.97)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
          animation: 'fadeUp 0.2s ease both',
          zIndex: 9999,
        }}>
          {items.map((item, i) => (
            <button key={item.label} onClick={() => { item.action(); setOpen(false) }}
              style={{
                display: 'block', width: '100%', background: 'transparent',
                border: 'none', borderBottom: i < items.length-1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                padding: '14px 20px', textAlign: 'left',
                fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600,
                color: item.danger ? '#ef4444' : '#ffffff',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = item.danger ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── 3D Background (Guest) ──────────────────────────────────────
function Background3D() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e) => setMouse({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * -14,
    })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  const shapes = [
    { w: 120, h: 120, top: '8%',  left: '6%',  color: 'rgba(22,163,74,0.18)',   delay: 0,   rot: -12, speed: 6 },
    { w: 80,  h: 80,  top: '15%', right: '8%', color: 'rgba(255,255,255,0.08)', delay: 1,   rot: 20,  speed: 5 },
    { w: 60,  h: 60,  top: '55%', left: '4%',  color: 'rgba(22,163,74,0.12)',   delay: 0.5, rot: 35,  speed: 7 },
    { w: 100, h: 100, top: '70%', right: '5%', color: 'rgba(255,255,255,0.06)', delay: 1.5, rot: -20, speed: 4 },
    { w: 50,  h: 50,  top: '35%', left: '15%', color: 'rgba(74,222,128,0.15)',  delay: 2,   rot: 45,  speed: 8 },
    { w: 70,  h: 70,  top: '25%', right: '18%',color: 'rgba(22,163,74,0.10)',   delay: 0.8, rot: -30, speed: 5 },
  ]

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Dark gradient base */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #0a0f0a 0%, #0d1a0e 40%, #0a0d0a 100%)',
      }} />

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        transform: `perspective(800px) rotateX(${mouse.y * 0.3}deg) rotateY(${mouse.x * 0.2}deg)`,
        transition: 'transform 0.1s ease-out',
      }} />

      {/* Floating shapes */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `translate(${mouse.x * 0.3}px, ${mouse.y * 0.3}px)`,
        transition: 'transform 0.15s ease-out',
      }}>
        {shapes.map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: s.w, height: s.h,
            background: s.color,
            borderRadius: '20px',
            top: s.top, left: s.left, right: s.right,
            transform: `rotate(${s.rot}deg)`,
            animation: `float ${s.speed}s ease-in-out ${s.delay}s infinite`,
            boxShadow: `0 8px 32px ${s.color}`,
            border: '1px solid rgba(255,255,255,0.05)',
          }} />
        ))}
      </div>

      {/* Green glow */}
      <div style={{
        position: 'absolute',
        width: '500px', height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)',
        top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}

// ── Guest Page ─────────────────────────────────────────────────
function GuestPage() {
  const navigate = useNavigate()

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <Background3D />

      {/* Top bar */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 28px',
      }}>
        {/* Logo + 3 dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <GuestDotsMenu />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '30px', height: '30px', background: '#22c55e',
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#0a0f0a', fontSize: '14px', fontWeight: 900 }}>S</span>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
              SentiScope
            </span>
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
        padding: '0 24px 180px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(22,163,74,0.15)',
          border: '1px solid rgba(22,163,74,0.3)',
          borderRadius: '100px', padding: '5px 16px', marginBottom: '28px',
        }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: '#22c55e',
          }}>
            RoBERTa-powered · Live
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(40px, 7vw, 72px)',
          fontWeight: 800, color: '#ffffff',
          lineHeight: 1.06, letterSpacing: '-0.03em',
          marginBottom: '20px',
        }}>
          Understand the
          <br />
          <span style={{ color: '#22c55e' }}>sentiment</span> behind
          <br />
          any text.
        </h1>

        <p style={{
          fontSize: '17px', color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.7, marginBottom: '40px',
          maxWidth: '480px', fontWeight: 300,
        }}>
          Paste tweets, paragraphs or lists.
          Get instant positive · negative · neutral · irrelevant classification.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/register')} className="btn btn-accent"
            style={{ padding: '14px 32px', fontSize: '15px' }}>
            Get started free
          </button>
          <button onClick={() => navigate('/login')} style={{
            padding: '14px 32px', fontSize: '15px', fontFamily: 'var(--font-display)',
            fontWeight: 600, background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px',
            color: '#ffffff', cursor: 'pointer', transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.14)'}
            onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.08)'}
          >
            Sign in
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  )
}

// ── Results Panel (after prediction) ──────────────────────────
function ResultsPanel({ results, stats }) {
  if (!results || results.length === 0) return null

  const pieData = stats ? ['positive','negative','neutral','irrelevant']
    .filter(k => stats[k] > 0)
    .map(k => ({ name: k, value: stats[k] })) : []

  const barData = stats ? [
    { name: 'Positive',   value: stats.positive   || 0, fill: '#22c55e' },
    { name: 'Negative',   value: stats.negative   || 0, fill: '#ef4444' },
    { name: 'Neutral',    value: stats.neutral    || 0, fill: '#f59e0b' },
    { name: 'Irrelevant', value: stats.irrelevant || 0, fill: '#8b5cf6' },
  ] : []

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: '20px', padding: '0 24px 160px',
      maxWidth: '1100px', margin: '0 auto', width: '100%',
    }}>
      {/* LEFT partition — text + sentiment */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px', padding: '24px',
        maxHeight: '500px', overflowY: 'auto',
        animation: 'fadeUp 0.4s ease both',
      }}>
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)', marginBottom: '16px',
        }}>
          Analysis Results
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {results.map((r, i) => (
            <div key={i} style={{
              borderBottom: i < results.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              paddingBottom: i < results.length - 1 ? '14px' : 0,
              animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
            }}>
              {/* Text line with bullet */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.3)',
                  flexShrink: 0, marginTop: '7px',
                }} />
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                  {r.original_text}
                </span>
              </div>

              {/* Sentiment line with bullet */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '16px' }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: SENTIMENT_COLORS[r.sentiment] || '#fff',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: SENTIMENT_COLORS[r.sentiment] || '#fff',
                }}>
                  {r.sentiment}
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                  {Math.round(r.confidence * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT partition — pie + bar charts */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '16px',
        animation: 'fadeUp 0.4s ease 0.1s both',
      }}>
        {/* Pie chart */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '20px', flex: 1,
        }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', marginBottom: '12px',
          }}>
            Distribution
          </p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  paddingAngle={3} dataKey="value" animationBegin={0} animationDuration={600}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={SENTIMENT_COLORS[entry.name]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }} labelStyle={{ color: '#fff' }}
                />
                <Legend formatter={v => (
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', textTransform: 'capitalize' }}>{v}</span>
                )} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>
              No data yet
            </div>
          )}
        </div>

        {/* Bar chart */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '20px', flex: 1,
        }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', marginBottom: '12px',
          }}>
            Count
          </p>
          {barData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>
              No data yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Logged-in workspace ────────────────────────────────────────
function WorkspacePage({ onAnalyse, loading, results, stats, error }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', background: '#22c55e',
            borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#0a0a0a', fontSize: '13px', fontWeight: 900 }}>S</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
            SentiScope
          </span>
        </div>
        <UserDotsMenu />
      </div>

      {/* Error */}
      {error && (
        <div style={{
          margin: '16px 24px 0',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '10px', padding: '12px 16px',
          color: '#ef4444', fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '32px' }}>
        {!results ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '0 24px 180px', textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)', marginBottom: '16px',
            }}>
              Workspace
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800, color: '#ffffff',
              letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '12px',
            }}>
              Analyse sentiment
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.3)', maxWidth: '380px' }}>
              Paste text below. Single tweet or multiple lines for batch analysis.
            </p>
          </div>
        ) : (
          <ResultsPanel results={results} stats={stats} />
        )}
      </main>

      <SearchBar onSubmit={onAnalyse} loading={loading} dark />
    </div>
  )
}

// ── Main Export ────────────────────────────────────────────────
export default function Dashboard() {
  const [results, setResults] = useState(null)
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const navigate = useNavigate()
  const authed = isAuthenticated()

  const fetchStats = useCallback(async () => {
    if (!authed) return
    try {
      const res = await getStats()
      setStats(res.data)
    } catch (_) {}
  }, [authed])

  useEffect(() => { fetchStats() }, [fetchStats])

  const handleAnalyse = async (text) => {
    if (!authed) { navigate('/login'); return }
    setLoading(true); setError('')
    try {
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
      const payload = lines.length > 1 ? lines : text
      const res = await predict(payload)
      setResults(res.data.results)
      await fetchStats()
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed.')
    } finally {
      setLoading(false)
    }
  }

  if (authed) {
    return <WorkspacePage onAnalyse={handleAnalyse} loading={loading} results={results} stats={stats} error={error} />
  }

  return (
    <div>
      <GuestPage />
      <SearchBar onSubmit={handleAnalyse} loading={loading} dark />
    </div>
  )
}