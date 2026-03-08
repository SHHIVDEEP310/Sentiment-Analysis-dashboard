// src/components/SentimentTextDisplay.jsx
// Left: original text with sentiment labels. Right: classification details.

const BADGE_STYLES = {
  positive:   { bg: 'rgba(34,197,94,0.12)',   color: '#16a34a', label: 'POSITIVE' },
  negative:   { bg: 'rgba(239,68,68,0.12)',   color: '#dc2626', label: 'NEGATIVE' },
  neutral:    { bg: 'rgba(245,158,11,0.12)',  color: '#d97706', label: 'NEUTRAL'  },
  irrelevant: { bg: 'rgba(139,92,246,0.12)',  color: '#7c3aed', label: 'IRRELEVANT' },
}

function SentimentBadge({ sentiment }) {
  const s = BADGE_STYLES[sentiment] || BADGE_STYLES.neutral
  return (
    <span
      style={{
        display: 'inline-block',
        background: s.bg,
        color: s.color,
        fontFamily: 'var(--font-display)',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        padding: '2px 8px',
        borderRadius: '5px',
        marginRight: '8px',
        flexShrink: 0,
      }}
    >
      {s.label}
    </span>
  )
}

function ConfidenceBar({ value }) {
  const pct = Math.round(value * 100)
  const color =
    pct >= 80 ? '#22c55e' :
    pct >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--ink-muted)',
          marginBottom: '5px',
        }}
      >
        <span>Confidence</span>
        <span style={{ fontWeight: 600, color }}>{pct}%</span>
      </div>
      <div
        style={{
          height: '6px',
          background: 'var(--border)',
          borderRadius: '3px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: '3px',
            transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>
    </div>
  )
}

export default function SentimentTextDisplay({ results }) {
  if (!results || results.length === 0) return null

  const isSingle = results.length === 1

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        padding: '0 24px',
        marginBottom: '24px',
      }}
    >
      {/* LEFT: original text with labels */}
      <div
        className="card-3d animate-slide-in"
        style={{ padding: '24px', maxHeight: '400px', overflowY: 'auto' }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            marginBottom: '16px',
          }}
        >
          Input Text
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {results.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 12px',
                background: 'var(--off-white)',
                borderRadius: '10px',
                animation: `slideIn 0.3s ease-out ${i * 0.05}s both`,
              }}
            >
              <SentimentBadge sentiment={r.sentiment} />
              <span style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--ink)' }}>
                {r.original_text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: classification details */}
      <div
        className="card-3d animate-slide-in"
        style={{
          padding: '24px',
          maxHeight: '400px',
          overflowY: 'auto',
          animationDelay: '0.08s',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            marginBottom: '16px',
          }}
        >
          Classification Results
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {results.map((r, i) => (
            <div
              key={i}
              style={{
                borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none',
                paddingBottom: i < results.length - 1 ? '16px' : 0,
                animation: `fadeUp 0.35s ease-out ${i * 0.06}s both`,
              }}
            >
              {!isSingle && (
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--ink-faint)',
                    marginBottom: '8px',
                    fontStyle: 'italic',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  "{r.original_text.slice(0, 60)}{r.original_text.length > 60 ? '…' : ''}"
                </p>
              )}

              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '4px' }}>Sentiment</div>
                  <SentimentBadge sentiment={r.sentiment} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '4px' }}>Class ID</div>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '14px',
                      color: 'var(--ink)',
                      background: 'var(--off-white)',
                      padding: '2px 10px',
                      borderRadius: '6px',
                    }}
                  >
                    {r.class_id}
                  </span>
                </div>
              </div>

              <ConfidenceBar value={r.confidence} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}