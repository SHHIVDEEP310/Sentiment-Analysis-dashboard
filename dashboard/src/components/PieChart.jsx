// src/components/PieChart.jsx
// Aggregate sentiment distribution chart using Recharts.

import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = {
  positive:   '#22c55e',
  negative:   '#ef4444',
  neutral:    '#f59e0b',
  irrelevant: '#8b5cf6',
}

const LABEL_MAP = {
  positive:   'Positive',
  negative:   'Negative',
  neutral:    'Neutral',
  irrelevant: 'Irrelevant',
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  const pct = payload[0].payload.pct
  return (
    <div
      className="card-3d"
      style={{ padding: '12px 16px', background: 'var(--white)', minWidth: '130px' }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '13px',
          color: COLORS[name],
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '4px',
        }}
      >
        {LABEL_MAP[name]}
      </div>
      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)' }}>{value}</div>
      <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{pct}% of total</div>
    </div>
  )
}

export default function PieChart({ stats }) {
  if (!stats || stats.total === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '48px',
          color: 'var(--ink-faint)',
          fontSize: '14px',
        }}
      >
        No predictions yet. Analyse some text to see your distribution.
      </div>
    )
  }

  const data = ['positive', 'negative', 'neutral', 'irrelevant']
    .filter((k) => stats[k] > 0)
    .map((k) => ({
      name: k,
      value: stats[k],
      pct: Math.round((stats[k] / stats.total) * 100),
    }))

  return (
    <div
      className="card-3d"
      style={{
        margin: '0 24px 120px',  // 120px bottom margin clears fixed SearchBar
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Header */}
      <div style={{ width: '100%', marginBottom: '24px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
          }}
        >
          Sentiment Distribution
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--ink-faint)', marginTop: '4px' }}>
          {stats.total} prediction{stats.total !== 1 ? 's' : ''} analysed
        </p>
      </div>

      {/* Stat chips */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '32px',
        }}
      >
        {data.map((d) => (
          <div
            key={d.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--off-white)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '8px 14px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '3px',
                background: COLORS[d.name],
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
              {LABEL_MAP[d.name]}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '14px',
                color: 'var(--ink)',
              }}
            >
              {d.value}
            </span>
          </div>
        ))}
      </div>

      {/* Pie */}
      <ResponsiveContainer width="100%" height={320}>
        <RechartsPie>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={140}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name]}
                stroke="var(--white)"
                strokeWidth={3}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span
                style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink)' }}
              >
                {LABEL_MAP[value]}
              </span>
            )}
          />
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  )
}