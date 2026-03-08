// src/components/Contact.jsx
import { useNavigate } from 'react-router-dom'

export default function Contact() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #f0ede8 50%, #1a1714 100%)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 28px',
        borderBottom: '1px solid rgba(26,23,20,0.08)',
      }}>
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: '1px solid #e2ddd6', borderRadius: '8px',
          padding: '7px 14px', fontSize: '13px', cursor: 'pointer',
          fontFamily: 'var(--font-body)', color: '#6b6560',
        }}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', background: '#1a1714',
            borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: 900 }}>S</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700 }}>SentiScope</span>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px',
      }}>
        <div style={{
          background: '#ffffff', border: '1px solid #e2ddd6',
          borderRadius: '20px', padding: '48px',
          maxWidth: '480px', width: '100%',
          boxShadow: '0 20px 60px rgba(26,23,20,0.10)',
          animation: 'fadeUp 0.4s ease both',
        }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#b0a89e', marginBottom: '12px',
          }}>
            Get in touch
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800,
            color: '#1a1714', letterSpacing: '-0.025em',
            lineHeight: 1.1, marginBottom: '32px',
          }}>
            Contact Us
          </h1>

          {/* Contact cards */}
          {[
            {
              icon: '✉',
              label: 'Email',
              value: 'support@sentiscope.ai',
              sub: 'We reply within 24 hours',
              href: 'mailto:support@sentiscope.ai',
            },
            {
              icon: '📞',
              label: 'Phone',
              value: '+91 98765 43210',
              sub: 'Mon–Fri, 9am–6pm IST',
              href: 'tel:+919876543210',
            },
            {
              icon: '📍',
              label: 'Location',
              value: 'Lucknow, Uttar Pradesh',
              sub: 'India',
              href: null,
            },
          ].map((c) => (
            <div key={c.label} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '16px', marginBottom: '12px',
              background: '#f7f7f5', border: '1px solid #e2ddd6',
              borderRadius: '12px', transition: 'box-shadow 0.15s',
            }}>
              <div style={{
                width: '40px', height: '40px', background: '#1a1714',
                borderRadius: '10px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '18px', flexShrink: 0,
              }}>
                {c.icon}
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#b0a89e', marginBottom: '2px' }}>{c.label}</p>
                {c.href ? (
                  <a href={c.href} style={{
                    fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600,
                    color: '#1a1714', textDecoration: 'none',
                  }}
                    onMouseEnter={e => e.target.style.color = '#16a34a'}
                    onMouseLeave={e => e.target.style.color = '#1a1714'}
                  >
                    {c.value}
                  </a>
                ) : (
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: '#1a1714' }}>
                    {c.value}
                  </p>
                )}
                <p style={{ fontSize: '12px', color: '#b0a89e', marginTop: '2px' }}>{c.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}