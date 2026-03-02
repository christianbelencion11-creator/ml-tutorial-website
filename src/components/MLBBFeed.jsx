import React, { useState, useEffect } from 'react'
import { FaFire, FaExternalLinkAlt, FaSyncAlt, FaNewspaper, FaClock } from 'react-icons/fa'

// FREE rss2json.com — no API key, no storage, no cost
// Converts any RSS feed to JSON via GET request
const RSS_SOURCES = [
  {
    name: 'MLBB News',
    url: 'https://mobilelegendsnews.com/feed',
    color: '#ff0000',
  },
  {
    name: 'GosuGamers MLBB',
    url: 'https://www.gosugamers.net/mobile-legends/articles.rss',
    color: '#ff8c00',
  },
]

const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url='

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim() || ''
}

export default function MLBBFeed() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeSource, setActiveSource] = useState(0)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchFeed = async (sourceIdx = activeSource) => {
    setLoading(true)
    setError(false)
    try {
      const source = RSS_SOURCES[sourceIdx]
      const res = await fetch(`${RSS2JSON}${encodeURIComponent(source.url)}&count=12`)
      const data = await res.json()

      if (data.status !== 'ok') throw new Error('Feed error')

      const items = (data.items || []).map(item => ({
        title: item.title || '',
        link: item.link || '#',
        thumbnail: item.thumbnail || item.enclosure?.link || extractImg(item.description) || null,
        description: stripHtml(item.description).substring(0, 120),
        pubDate: item.pubDate,
        author: item.author || source.name,
        source: source.name,
        sourceColor: source.color,
      }))

      setArticles(items)
      setLastUpdated(new Date())
    } catch (e) {
      setError(true)
    }
    setLoading(false)
  }

  function extractImg(html) {
    const match = html?.match(/<img[^>]+src=["']([^"']+)["']/i)
    return match ? match[1] : null
  }

  useEffect(() => { fetchFeed(activeSource) }, [activeSource])

  const switchSource = (idx) => {
    setActiveSource(idx)
  }

  return (
    <section style={{ margin: '3rem 0 2rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 24, background: '#ff0000' }} />
          <FaNewspaper style={{ color: '#ff0000', fontSize: '1rem' }} />
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#fff', letterSpacing: 2, textTransform: 'uppercase' }}>
            MLBB News Feed
          </h2>
          {/* Live pulse dot */}
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,0,0,0.08)', border: '1px solid rgba(255,0,0,0.2)', color: '#ff4444', fontSize: '0.6rem', fontWeight: 900, letterSpacing: 2, padding: '2px 8px', borderRadius: 3 }}>
            <span style={{ width: 6, height: 6, background: '#ff0000', borderRadius: '50%', display: 'inline-block', animation: 'newsPulse 1.5s ease-in-out infinite' }} />
            LIVE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {lastUpdated && (
            <span style={{ color: '#2a2a2a', fontSize: '0.62rem', fontFamily: 'Courier New', display: 'flex', alignItems: 'center', gap: 4 }}>
              <FaClock size={9} /> {lastUpdated.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={() => fetchFeed(activeSource)}
            disabled={loading}
            style={{ background: 'transparent', border: '1px solid #1e1e1e', color: '#444', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.7rem', transition: 'all .2s', fontFamily: 'inherit' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#ff0000'; e.currentTarget.style.color = '#ff0000' }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#444' }}
          >
            <FaSyncAlt size={9} style={{ animation: loading ? 'newsSpin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Source tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '1rem', borderBottom: '1px solid #111', paddingBottom: 1 }}>
        {RSS_SOURCES.map((src, i) => (
          <button key={i} onClick={() => switchSource(i)}
            style={{
              background: 'transparent', border: 'none',
              borderBottom: activeSource === i ? `2px solid ${src.color}` : '2px solid transparent',
              color: activeSource === i ? '#fff' : '#444',
              padding: '7px 14px', fontSize: '0.78rem', fontWeight: 700,
              cursor: 'pointer', letterSpacing: 0.5, marginBottom: -1,
              transition: 'color .2s', fontFamily: 'inherit',
            }}>
            {src.name}
          </button>
        ))}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: '#0d0d0d', borderRadius: 10, overflow: 'hidden', animation: 'newsPulse2 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }}>
              <div style={{ height: 120, background: '#111' }} />
              <div style={{ padding: '12px' }}>
                <div style={{ height: 12, background: '#161616', borderRadius: 4, marginBottom: 8, width: '90%' }} />
                <div style={{ height: 10, background: '#141414', borderRadius: 4, width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div style={{ background: 'rgba(255,0,0,0.04)', border: '1px solid rgba(255,0,0,0.12)', borderRadius: 10, padding: '28px', textAlign: 'center' }}>
          <p style={{ color: '#444', fontSize: '0.85rem', margin: '0 0 14px' }}>Could not load news feed right now.</p>
          <button onClick={() => fetchFeed(activeSource)}
            style={{ background: '#ff0000', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'inherit' }}>
            Try Again
          </button>
        </div>
      )}

      {/* Articles grid */}
      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {articles.map((article, i) => (
            <a
              key={i}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <div
                style={{ background: '#0d0d0d', border: '1px solid #141414', borderRadius: 10, overflow: 'hidden', transition: 'all .2s', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
                onMouseOver={e => { e.currentTarget.style.border = `1px solid ${article.sourceColor}`; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(255,0,0,0.15)` }}
                onMouseOut={e => { e.currentTarget.style.border = '1px solid #141414'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {/* Thumbnail */}
                <div style={{ width: '100%', height: 120, background: '#111', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                  {article.thumbnail ? (
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => { e.target.parentElement.style.background = '#0d0d0d' ; e.target.style.display = 'none' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d0d' }}>
                      <FaNewspaper style={{ color: '#1e1e1e', fontSize: '2rem' }} />
                    </div>
                  )}
                  {/* Source tag */}
                  <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.85)', border: `1px solid ${article.sourceColor}44`, color: article.sourceColor, fontSize: '0.58rem', fontWeight: 900, padding: '2px 7px', borderRadius: 3, letterSpacing: 1 }}>
                    {article.source}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h4 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#e0e0e0', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.title}
                  </h4>
                  {article.description && (
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#444', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: 'Courier New' }}>
                      {article.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 6, borderTop: '1px solid #111' }}>
                    <span style={{ fontSize: '0.62rem', color: '#2a2a2a', fontFamily: 'Courier New' }}>
                      {article.pubDate ? timeAgo(article.pubDate) : ''}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ff4444', fontSize: '0.62rem', fontWeight: 700 }}>
                      Read <FaExternalLinkAlt size={9} />
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Footer note */}
      {!loading && !error && (
        <p style={{ color: '#1a1a1a', fontSize: '0.6rem', fontFamily: 'Courier New', marginTop: '1rem', textAlign: 'right' }}>
          News from {RSS_SOURCES[activeSource].name} · Not affiliated with Moonton
        </p>
      )}

      <style>{`
        @keyframes newsPulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
        @keyframes newsPulse2 { 0%,100%{opacity:.4} 50%{opacity:.9} }
        @keyframes newsSpin { to{transform:rotate(360deg)} }
      `}</style>
    </section>
  )
}