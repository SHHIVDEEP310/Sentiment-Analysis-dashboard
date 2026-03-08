// src/components/About.jsx
import { useNavigate } from 'react-router-dom'

export default function About() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0a0f0a 0%, #0d1a0e 60%, #111 100%)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button onClick={() => navigate('/')} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px', padding: '7px 14px', fontSize: '13px',
          cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.6)',
        }}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', background: '#22c55e',
            borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#0a0f0a', fontSize: '13px', fontWeight: 900 }}>S</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: '#fff' }}>SentiScope</span>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px',
      }}>
        <div style={{ maxWidth: '600px', width: '100%', animation: 'fadeUp 0.4s ease both' }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#22c55e', marginBottom: '12px',
          }}>
            About SentiScope
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 800, color: '#ffffff',
            letterSpacing: '-0.025em', lineHeight: 1.08, marginBottom: '24px',
          }}>
            AI-powered sentiment
            <br />at your fingertips.
          </h1>

          <p style={{
            fontSize: '16px', color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.8, marginBottom: '40px', fontWeight: 300,
          }}>
            SentiScope is a real-time sentiment analysis platform powered by a fine-tuned
            RoBERTa model. Built for ML engineers, researchers, and developers who need
            fast, accurate text classification at scale.
          </p>

          {/* Feature grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '40px' }}>
            {[
              { title: '4-Class Model', desc: 'Positive · Negative · Neutral · Irrelevant' },
              { title: 'RoBERTa Base', desc: 'Fine-tuned on custom dataset' },
              { title: 'Batch Analysis', desc: 'Analyse multiple texts at once' },
              { title: 'History Tracking', desc: 'Full prediction history with stats' },
              { title: 'Confidence Scores', desc: 'Softmax probability per class' },
              { title: 'REST API', desc: 'FastAPI backend, JWT auth' },
            ].map((f) => (
              <div key={f.title} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px', padding: '16px',
              }}>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: '13px',
                  fontWeight: 700, color: '#ffffff', marginBottom: '4px',
                }}>
                  {f.title}
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <button onClick={() => navigate('/register')} className="btn btn-accent"
            style={{ padding: '13px 28px', fontSize: '15px' }}>
            Get started free →
          </button>
        </div>
      </div>
    </div>
  )
}