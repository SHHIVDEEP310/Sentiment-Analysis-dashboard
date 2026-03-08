// src/components/SearchBar.jsx
import { useState, useRef } from 'react'

export default function SearchBar({ onSubmit, loading, dark = false }) {
  const [text, setText] = useState('')
  const textareaRef = useRef()

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    onSubmit(trimmed)
  }

  const bg     = dark ? 'rgba(255,255,255,0.06)'  : 'rgba(255,255,255,0.90)'
  const border = dark ? 'rgba(255,255,255,0.10)'  : 'rgba(226,221,214,0.8)'
  const shadow = dark
    ? '0 -4px 30px rgba(0,0,0,0.4), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'
    : '0 -4px 30px rgba(26,23,20,0.06), 0 20px 60px rgba(26,23,20,0.12), inset 0 1px 0 rgba(255,255,255,0.9)'
  const textColor   = dark ? 'rgba(255,255,255,0.85)' : '#1a1714'
  const placeholderColor = dark ? 'rgba(255,255,255,0.25)' : '#b0a89e'

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      zIndex: 200, display: 'flex', justifyContent: 'center',
      padding: '0 24px 28px', pointerEvents: 'none',
    }}>
      <div style={{
        width: '100%', maxWidth: '860px', pointerEvents: 'all',
        borderRadius: '20px',
        background: dark ? 'rgba(20,20,20,0.85)' : 'rgba(255,255,255,0.90)',
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        border: `1px solid ${border}`,
        boxShadow: shadow,
        padding: '16px 16px 16px 20px',
        display: 'flex', gap: '12px', alignItems: 'flex-end',
      }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px'
          }}
          onKeyDown={handleKeyDown}
          placeholder="Paste a tweet, paragraph, or multiple lines…  (Ctrl+Enter to analyse)"
          rows={2}
          style={{
            flex: 1, resize: 'none', border: 'none', outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-body)', fontSize: '15px',
            color: textColor, lineHeight: 1.6,
            minHeight: '48px', maxHeight: '180px', overflow: 'auto',
          }}
        />

        <style>{`
          textarea::placeholder { color: ${placeholderColor}; }
        `}</style>

        <div style={{ display: 'flex', gap: '8px', flexShrink: 0, paddingBottom: '2px' }}>
          {text && (
            <button onClick={() => { setText(''); textareaRef.current.style.height = 'auto' }}
              style={{
                background: dark ? 'rgba(255,255,255,0.08)' : 'var(--off-white)',
                border: `1px solid ${border}`, borderRadius: '10px',
                padding: '10px 14px', fontSize: '13px',
                color: dark ? 'rgba(255,255,255,0.5)' : 'var(--ink-muted)',
                cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s',
              }}
            >
              Clear
            </button>
          )}
          <button onClick={handleSubmit} disabled={!text.trim() || loading}
            className="btn btn-accent"
            style={{ padding: '10px 22px', opacity: (!text.trim() || loading) ? 0.5 : 1 }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '14px', height: '14px',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Analysing
              </span>
            ) : 'Analyse →'}
          </button>
        </div>
      </div>
    </div>
  )
}