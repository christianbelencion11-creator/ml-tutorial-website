import React, { useState, useEffect, useRef } from 'react'
import { FaShieldAlt, FaEye, FaEyeSlash, FaSkull, FaExclamationTriangle } from 'react-icons/fa'

const ADMIN_PASSWORD = '09195911297'
const MAX_ATTEMPTS = 5
const LOCKOUT_SECONDS = 60

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [attempts, setAttempts] = useState(() => parseInt(sessionStorage.getItem('pmc_attempts') || '0'))
  const [lockoutUntil, setLockoutUntil] = useState(() => parseInt(sessionStorage.getItem('pmc_lockout') || '0'))
  const [countdown, setCountdown] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [scanStatus, setScanStatus] = useState('')
  const [shake, setShake] = useState(false)
  const [glitch, setGlitch] = useState(false)
  const [particles, setParticles] = useState([])
  const inputRef = useRef(null)

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000))
      setCountdown(remaining)
      if (remaining === 0 && lockoutUntil > 0) {
        setLockoutUntil(0)
        sessionStorage.removeItem('pmc_lockout')
        setAttempts(0)
        sessionStorage.removeItem('pmc_attempts')
      }
    }, 500)
    return () => clearInterval(interval)
  }, [lockoutUntil])

  // Generate particles on mount
  useEffect(() => {
    const pts = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 8 + 4,
      delay: Math.random() * 5,
    }))
    setParticles(pts)
  }, [])

  const isLockedOut = countdown > 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isLockedOut || scanning) return

    setScanning(true)
    setScanStatus('INITIALIZING SECURITY SCAN...')

    // Fake scanning sequence
    await delay(400); setScanStatus('VERIFYING IDENTITY...')
    await delay(400); setScanStatus('CHECKING CREDENTIALS...')
    await delay(400); setScanStatus('ANALYZING BIOMETRICS...')
    await delay(300)

    if (password === ADMIN_PASSWORD) {
      setScanStatus('✓ ACCESS GRANTED')
      setGlitch(true)
      await delay(800)
      onSuccess()
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      sessionStorage.setItem('pmc_attempts', newAttempts.toString())

      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_SECONDS * 1000
        setLockoutUntil(until)
        sessionStorage.setItem('pmc_lockout', until.toString())
        setScanStatus('⚠ SYSTEM LOCKDOWN INITIATED')
      } else {
        setScanStatus(`✗ ACCESS DENIED — ${MAX_ATTEMPTS - newAttempts} ATTEMPTS REMAINING`)
        setShake(true)
        setTimeout(() => setShake(false), 600)
      }
      setPassword('')
      setScanning(false)
    }
  }

  const delay = (ms) => new Promise(r => setTimeout(r, ms))
  const attemptsLeft = MAX_ATTEMPTS - attempts

  return (
    <div className="al-root">
      {/* Animated grid background */}
      <div className="al-grid" />

      {/* Floating particles */}
      {particles.map(p => (
        <div key={p.id} className="al-particle" style={{
          left: `${p.x}%`, top: `${p.y}%`,
          width: `${p.size}px`, height: `${p.size}px`,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}

      {/* Scanline overlay */}
      <div className="al-scanlines" />

      {/* Corner decorations */}
      <div className="al-corner al-corner-tl" />
      <div className="al-corner al-corner-tr" />
      <div className="al-corner al-corner-bl" />
      <div className="al-corner al-corner-br" />

      {/* Main panel */}
      <div className={`al-panel ${shake ? 'al-shake' : ''} ${glitch ? 'al-glitch' : ''}`}>

        {/* Top bar */}
        <div className="al-topbar">
          <span className="al-topbar-dot red" />
          <span className="al-topbar-dot yellow" />
          <span className="al-topbar-dot green" />
          <span className="al-topbar-label">PMC_SECURE_ACCESS_v2.0</span>
          <span className="al-topbar-status">{isLockedOut ? '🔴 LOCKED' : '🟢 ONLINE'}</span>
        </div>

        {/* Shield icon */}
        <div className={`al-shield-wrap ${scanning && !isLockedOut ? 'al-scanning' : ''}`}>
          <div className="al-shield-ring al-ring-1" />
          <div className="al-shield-ring al-ring-2" />
          <div className="al-shield-ring al-ring-3" />
          <div className="al-shield-icon">
            {isLockedOut ? <FaSkull size={32} /> : <FaShieldAlt size={32} />}
          </div>
        </div>

        {/* Title */}
        <div className="al-title">
          <div className="al-title-main">PMC GAMING</div>
          <div className="al-title-sub">⚡ ADMIN TERMINAL ⚡</div>
        </div>

        {/* Warning banner - show after failed attempts */}
        {attempts > 0 && !isLockedOut && (
          <div className="al-warning-bar">
            <FaExclamationTriangle size={12} />
            <span>WARNING: {attemptsLeft} ATTEMPT{attemptsLeft !== 1 ? 'S' : ''} REMAINING BEFORE LOCKOUT</span>
          </div>
        )}

        {/* LOCKOUT STATE */}
        {isLockedOut ? (
          <div className="al-lockout">
            <div className="al-lockout-icon"><FaSkull size={40} /></div>
            <div className="al-lockout-title">SYSTEM LOCKED</div>
            <div className="al-lockout-text">TOO MANY FAILED ATTEMPTS</div>
            <div className="al-lockout-timer">
              <span className="al-timer-label">RETRY IN</span>
              <span className="al-timer-count">{String(Math.floor(countdown / 60)).padStart(2,'0')}:{String(countdown % 60).padStart(2,'0')}</span>
            </div>
            <div className="al-lockout-sub">This incident has been logged.</div>
          </div>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleSubmit} className="al-form">
            <div className="al-field-label">AUTHENTICATION CODE</div>
            <div className="al-input-wrap">
              <div className="al-input-prefix">▶</div>
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="al-input"
                placeholder="Enter classified password..."
                disabled={scanning}
                autoFocus
                autoComplete="off"
              />
              <button
                type="button"
                className="al-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>

            {/* Attempt dots */}
            <div className="al-attempt-dots">
              {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                <div key={i} className={`al-dot ${i < attempts ? 'al-dot-used' : 'al-dot-free'}`} />
              ))}
              <span className="al-dot-label">{attempts > 0 ? `${attempts} FAILED` : 'ATTEMPTS'}</span>
            </div>

            {/* Scan status */}
            {scanStatus && (
              <div className={`al-scan-status ${scanStatus.includes('GRANTED') ? 'al-status-ok' : scanStatus.includes('DENIED') || scanStatus.includes('LOCKDOWN') ? 'al-status-fail' : 'al-status-scan'}`}>
                <span className="al-status-cursor" />
                {scanStatus}
              </div>
            )}

            <button
              type="submit"
              className="al-submit-btn"
              disabled={scanning || !password}
            >
              {scanning ? (
                <span className="al-btn-scanning">
                  <span className="al-spinner" /> SCANNING...
                </span>
              ) : (
                '⚡ AUTHENTICATE'
              )}
            </button>

            <div className="al-footer-text">
              UNAUTHORIZED ACCESS IS PROHIBITED AND WILL BE REPORTED
            </div>
          </form>
        )}
      </div>

      {/* Bottom status bar */}
      <div className="al-statusbar">
        <span>SYS: ONLINE</span>
        <span>ENC: AES-256</span>
        <span>IP: MONITORED</span>
        <span className="al-blink">● SECURE</span>
      </div>
    </div>
  )
}