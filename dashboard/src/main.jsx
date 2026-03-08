// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/global.css'

import Dashboard from './components/Dashboard'
import Login     from './components/Login'
import Register  from './components/Register'
import History   from './components/History'
import Contact   from './components/Contact'
import About     from './components/About'

function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        <Route path="/"         element={<Dashboard />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history"  element={<History />} />
        <Route path="/contact"  element={<Contact />} />
        <Route path="/about"    element={<About />} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)