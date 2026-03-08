// src/components/History.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHistory, isAuthenticated } from '../services/api'
import ThreeDotsMenu from './ThreeDotsMenu'

const BADGE_COLORS = {
  positive:   { bg: 'rgba(34,197,94,0.12)',   color: '#16a34a' },
  negative:   { bg: 'rgba(239,68,68,0.12)',   color: '#dc2626' },
  neutral:    { bg: 'rgba(245,158,11,0.12)',  color: '#d97706' },
  irrelevant: { bg: 'rgba(139,92,246,0.12)',  color: '#7c3aed' },
}

export default function History() {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/login'); return }
    setLoading(true)
    getHistory(page, 15)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [page, navigate])

  const totalPages = data ? Math.ceil(data.total / 15) : 1

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'var(--off-white)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              color: 'var(--ink-muted)',
            }}
          >
            ← Back
          </button>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 700,
            }}
          >
            Prediction History
          </h1>
        </div>
        <ThreeDotsMenu />
      </header>

      <main style={{ padding: '32px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ink-muted)' }}>
            Loading…
          </div>
        ) : !data?.items?.length ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--ink-faint)' }}>
            No predictions yet. Go back and analyse some text!
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--ink-muted)', fontSize: '14px', marginBottom: '20px' }}>
              {data.total} prediction{data.total !== 1 ? 's' : ''} total
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.items.map((item, i) => {
                const bc = BADGE_COLORS[item.sentiment] || BADGE_COLORS.neutral
                return (
                  <div
                    key={item.id}
                    className="card-3d"
                    style={{
                      padding: '18px 22px',
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '16px',
                      alignItems: 'center',
                      animation: `fadeUp 0.3s ease-out ${i * 0.03}s both`,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'var(--ink)',
                          marginBottom: '6px',
                          lineHeight: 1.5,
                        }}
                      >
                        {item.original_text.length > 120
                          ? item.original_text.slice(0, 120) + '…'
                          : item.original_text}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          background: bc.bg,
                          color: bc.color,
                          fontFamily: 'var(--font-display)',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          marginBottom: '4px',
                        }}
                      >
                        {item.sentiment}
                      </span>
                      <p style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                        {Math.round(item.confidence * 100)}% confidence
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '32px',
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', opacity: page === 1 ? 0.4 : 1 }}
                >
                  ← Prev
                </button>
                <span
                  style={{
                    padding: '8px 16px',
                    fontFamily: 'var(--font-display)',
                    fontSize: '14px',
                    color: 'var(--ink-muted)',
                  }}
                >
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', opacity: page === totalPages ? 0.4 : 1 }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}