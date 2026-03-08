// src/components/ThreeDotsMenu.jsx
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, isAuthenticated } from '../services/api'

export default function ThreeDotsMenu() {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const menuRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setOpen(false)
  }

  return (
    <div ref={menuRef} style={{ position: 'relative', zIndex: 1000 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Open menu"
        style={{
          background: hovered ? 'rgba(255,255,255,0.12)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          padding: '10px',
          borderRadius: '12px',
          transition: 'background 0.2s',
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: 'block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#ffffff',                          // ← white dots
              transition: `transform 0.3s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.05}s, box-shadow 0.3s`,
              transform: hovered
                ? `scale(1.4) translateY(${[-2, 0, 2][i]}px)`
                : 'scale(1)',
              boxShadow: hovered
                ? '0 0 8px rgba(255,255,255,0.7), 0 2px 6px rgba(255,255,255,0.3)'
                : 'none',
            }}
          />
        ))}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '180px',
            borderRadius: '14px',
            overflow: 'hidden',
            background: 'rgba(15,15,15,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            animation: 'fadeUp 0.2s cubic-bezier(0.16,1,0.3,1) both',
          }}
        >
          {[
            { label: 'Dashboard', path: '/',         show: true },
            { label: 'Login',     path: '/login',    show: !isAuthenticated() },
            { label: 'Register',  path: '/register', show: !isAuthenticated() },
            { label: 'History',   path: '/history',  show: isAuthenticated() },
            { label: 'About',     path: '/about',    show: true },
          ]
            .filter((item) => item.show)
            .map((item, i, arr) => (
              <button
                key={item.label}
                onClick={() => { navigate(item.path); setOpen(false) }}
                style={{
                  display: 'block',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  padding: '13px 18px',
                  textAlign: 'left',
                  fontFamily: 'var(--font-display)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                {item.label}
              </button>
            ))}

          {isAuthenticated() && (
            <button
              onClick={handleLogout}
              style={{
                display: 'block',
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '13px 18px',
                textAlign: 'left',
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                fontWeight: 600,
                color: '#ef4444',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(239,68,68,0.08)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </div>
  )
}