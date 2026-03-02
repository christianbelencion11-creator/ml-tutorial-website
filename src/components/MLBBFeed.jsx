import React, { useState, useEffect } from 'react'
import { FaFire, FaStar, FaShieldAlt, FaBolt, FaSkull, FaHeart, FaSyncAlt, FaChevronRight } from 'react-icons/fa'
import { GiSwordBrandish, GiArrowhead, GiMagicSwirl } from 'react-icons/gi'
import { Link } from 'react-router-dom'

const HERO_LIST_URL = 'https://mlbb-stats.rone.dev/api/'
const HERO_RANK_URL = 'https://mlbb-stats.rone.dev/api/hero-rank/'

// Role colors & icons
const ROLE_META = {
  Tank:     { color: '#4a9eff', bg: 'rgba(74,158,255,0.1)', icon: <FaShieldAlt size={10} /> },
  Fighter:  { color: '#ff8c42', bg: 'rgba(255,140,66,0.1)', icon: <GiSwordBrandish size={10} /> },
  Assassin: { color: '#ff4444', bg: 'rgba(255,68,68,0.1)',  icon: <FaSkull size={10} /> },
  Mage:     { color: '#b44eff', bg: 'rgba(180,78,255,0.1)', icon: <GiMagicSwirl size={10} /> },
  Marksman: { color: '#ffdd44', bg: 'rgba(255,221,68,0.1)', icon: <GiArrowhead size={10} /> },
  Support:  { color: '#44ffaa', bg: 'rgba(68,255,170,0.1)', icon: <FaHeart size={10} /> },
  default:  { color: '#888',    bg: 'rgba(136,136,136,0.1)', icon: <FaBolt size={10} /> },
}

function getRoleMeta(role) {
  return ROLE_META[role] || ROLE_META.default
}

// Tier colors
const TIER = {
  S: { color: '#ff4444', label: 'S' },
  A: { color: '#ff8c42', label: 'A' },
  B: { color: '#ffdd44', label: 'B' },
  C: { color: '#888',    label: 'C' },
}

function getTier(winRate) {
  if (winRate >= 54) return TIER.S
  if (winRate >= 51) return TIER.A
  if (winRate >= 49) return TIER.B
  return TIER.C
}

export default function MLBBFeed() {
  const [heroes, setHeroes] = useState([])
  const [ranked, setRanked] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [tab, setTab] = useState('meta') // 'meta' | 'new'

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [heroRes, rankRes] = await Promise.all([
        fetch(HERO_LIST_URL),
        fetch(HERO_RANK_URL),
      ])

      if (!heroRes.ok || !rankRes.ok) throw new Error('API unavailable')

      const heroData = await heroRes.json()
      const rankData = await rankRes.json()

      // Hero list — sort by hero_id descending = newest first
      const heroList = Array.isArray(heroData?.data)
        ? heroData.data.sort((a, b) => (b.hero_id || 0) - (a.hero_id || 0))
        : []

      // Ranked heroes with win rate
      const rankList = Array.isArray(rankData?.data)
        ? rankData.data
            .filter(h => h.win_rate != null)
            .sort((a, b) => (b.win_rate || 0) - (a.win_rate || 0))
            .slice(0, 12)
        : []

      setHeroes(heroList)
      setRanked(rankList)
      setLastUpdated(new Date())
    } catch (err) {
      setError('Could not load MLBB data. API may be temporarily unavailable.')
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const newHeroes = heroes.slice(0, 8)

  return (
    <section style={{ margin: '3rem 0' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 4, height: 28, background: '#ff0000', borderRadius: 2 }} />
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#fff', letterSpacing: 2, textTransform: 'uppercase' }}>
            MLBB Live Feed
          </h2>
          <span style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)', color: '#ff4444', fontSize: '0.6rem', fontWeight: 900, letterSpacing: 2, padding: '2px 8px', borderRadius: 3 }}>
            LIVE
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {lastUpdated && (
            <span style={{ color: '#2a2a2a', fontSize: '0.65rem', fontFamily: 'Courier New' }}>
              Updated {lastUpdated.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button onClick={fetchData} disabled={loading}
            style={{ background: 'transparent', border: '1px solid #1e1e1e', color: '#444', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', transition: 'all .2s' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#ff0000'; e.currentTarget.style.color = '#ff0000' }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#444' }}>
            <FaSyncAlt size={10} style={{ animation: loading ? 'mlbbSpin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '1.2rem', borderBottom: '1px solid #111', paddingBottom: 1 }}>
        {[
          { key: 'meta', label: '🔥 Meta Heroes' },
          { key: 'new',  label: '✨ Newest Heroes' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ background: 'transparent', border: 'none', borderBottom: tab === t.key ? '2px solid #ff0000' : '2px solid transparent', color: tab === t.key ? '#fff' : '#444', padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', letterSpacing: 1, marginBottom: -1, transition: 'color .2s', fontFamily: 'inherit' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: '#0d0d0d', borderRadius: 10, height: 160, animation: 'mlbbPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ background: 'rgba(255,0,0,0.05)', border: '1px solid rgba(255,0,0,0.15)', borderRadius: 10, padding: '24px', textAlign: 'center', color: '#555', fontSize: '0.85rem' }}>
          <p style={{ margin: '0 0 12px' }}>{error}</p>
          <button onClick={fetchData} style={{ background: '#ff0000', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
            Try Again
          </button>
        </div>
      )}

      {/* META TAB */}
      {!loading && !error && tab === 'meta' && ranked.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
          {ranked.map((hero, idx) => {
            const winRate = parseFloat(hero.win_rate || 0)
            const tier = getTier(winRate)
            const role = hero.hero_role || hero.role || 'Unknown'
            const rm = getRoleMeta(role)
            return (
              <div key={hero.hero_id || idx}
                style={{ background: '#0d0d0d', border: '1px solid #141414', borderRadius: 10, overflow: 'hidden', transition: 'all .2s', cursor: 'default', position: 'relative' }}
                onMouseOver={e => { e.currentTarget.style.border = '1px solid #ff0000'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,0,0,0.2)' }}
                onMouseOut={e => { e.currentTarget.style.border = '1px solid #141414'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>

                {/* Rank badge */}
                <div style={{ position: 'absolute', top: 8, left: 8, background: '#000', borderRadius: 4, padding: '2px 6px', fontSize: '0.62rem', color: '#444', fontWeight: 900, fontFamily: 'Courier New', zIndex: 1 }}>
                  #{idx + 1}
                </div>

                {/* Tier badge */}
                <div style={{ position: 'absolute', top: 8, right: 8, background: `rgba(0,0,0,0.8)`, border: `1px solid ${tier.color}`, borderRadius: 4, padding: '2px 6px', fontSize: '0.65rem', color: tier.color, fontWeight: 900, zIndex: 1 }}>
                  {tier.label}
                </div>

                {/* Hero image */}
                <div style={{ width: '100%', aspectRatio: '1', background: '#111', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={hero.hero_icon || hero.icon || `https://mlbb-stats.rone.dev/api/hero-icon/${hero.hero_id}`}
                    alt={hero.hero_name || hero.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.style.display = 'none' }}
                  />
                  {/* Win rate overlay */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', padding: '12px 8px 6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: tier.color }}>
                      {winRate.toFixed(1)}% WR
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '10px 10px 12px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e0e0e0', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {hero.hero_name || hero.name || 'Unknown'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: rm.bg, border: `1px solid ${rm.color}22`, color: rm.color, fontSize: '0.62rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>
                      {rm.icon} {role}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* NEW HEROES TAB */}
      {!loading && !error && tab === 'new' && newHeroes.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
          {newHeroes.map((hero, idx) => {
            const role = hero.hero_role || hero.role || 'Unknown'
            const rm = getRoleMeta(role)
            const isNewest = idx === 0
            return (
              <div key={hero.hero_id || idx}
                style={{ background: '#0d0d0d', border: `1px solid ${isNewest ? '#ff0000' : '#141414'}`, borderRadius: 10, overflow: 'hidden', transition: 'all .2s', position: 'relative', boxShadow: isNewest ? '0 0 20px rgba(255,0,0,0.15)' : 'none' }}
                onMouseOver={e => { e.currentTarget.style.border = '1px solid #ff0000'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,0,0,0.2)' }}
                onMouseOut={e => { e.currentTarget.style.border = `1px solid ${isNewest ? '#ff0000' : '#141414'}`; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isNewest ? '0 0 20px rgba(255,0,0,0.15)' : 'none' }}>

                {isNewest && (
                  <div style={{ background: '#ff0000', color: '#fff', fontSize: '0.58rem', fontWeight: 900, letterSpacing: 2, padding: '3px 10px', textAlign: 'center' }}>
                    ✨ NEWEST
                  </div>
                )}

                <div style={{ width: '100%', aspectRatio: '1', background: '#111', overflow: 'hidden' }}>
                  <img
                    src={hero.hero_icon || hero.icon || `https://mlbb-stats.rone.dev/api/hero-icon/${hero.hero_id}`}
                    alt={hero.hero_name || hero.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.style.display = 'none' }}
                  />
                </div>

                <div style={{ padding: '10px 10px 12px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e0e0e0', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {hero.hero_name || hero.name || 'Unknown'}
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: rm.bg, border: `1px solid ${rm.color}22`, color: rm.color, fontSize: '0.62rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>
                      {rm.icon} {role}
                    </span>
                    {hero.hero_specialty && (
                      <span style={{ background: '#111', border: '1px solid #1e1e1e', color: '#555', fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4 }}>
                        {hero.hero_specialty}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer note */}
      {!loading && !error && (
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ color: '#1e1e1e', fontSize: '0.65rem', fontFamily: 'Courier New', margin: 0 }}>
            Data from mlbb-stats.rone.dev · Not affiliated with Moonton
          </p>
          <Link to="/tutorials" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ff4444', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', letterSpacing: 1 }}
            onMouseOver={e => e.currentTarget.style.color = '#ff0000'}
            onMouseOut={e => e.currentTarget.style.color = '#ff4444'}>
            See all tutorials <FaChevronRight size={10} />
          </Link>
        </div>
      )}

      <style>{`
        @keyframes mlbbSpin { to { transform: rotate(360deg); } }
        @keyframes mlbbPulse { 0%,100% { opacity:.4; } 50% { opacity:.8; } }
      `}</style>
    </section>
  )
}