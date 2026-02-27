import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { FaPlay, FaUsers, FaVideo, FaTrophy, FaGamepad, FaSkull, FaBolt, FaFire, FaCrown, FaYoutube } from 'react-icons/fa'

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID

function Home({ searchTerm, setSearchTerm }) {
  const navigate = useNavigate()
  const [subscriberCount, setSubscriberCount] = useState(null)
  const [loadingSubs, setLoadingSubs] = useState(true)

  // ✅ Fetch live subscriber count
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        if (!YOUTUBE_API_KEY || !CHANNEL_ID) return
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
        )
        const data = await res.json()
        const count = data?.items?.[0]?.statistics?.subscriberCount
        if (count) {
          // Format number nicely e.g. 12300 → "12.3K"
          const num = parseInt(count)
          if (num >= 1000000) {
            setSubscriberCount((num / 1000000).toFixed(1) + 'M')
          } else if (num >= 1000) {
            setSubscriberCount((num / 1000).toFixed(1) + 'K')
          } else {
            setSubscriberCount(num.toString())
          }
        }
      } catch (e) {
        console.error('Failed to fetch subscribers:', e)
      } finally {
        setLoadingSubs(false)
      }
    }
    fetchSubscribers()
  }, [])

  // ✅ Handle search — redirect to /tutorials with search
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm?.trim()) {
      navigate('/tutorials')
    }
  }

  return (
    <Container fluid className="home-container p-0">

      {/* HERO SECTION */}
      <div
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(
            rgba(0, 0, 0, 0.7),
            rgba(0, 0, 0, 0.7)
          ), url('https://club.jollymax.com/wp-content/uploads/2025/05/cover-14-1024x576.webp')`
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-center">
          <h1 className="hero-title">
            <span className="hero-title-main">PMC GAMING</span>
            <span className="hero-title-sub">TUTORIALS</span>
          </h1>
          <p className="hero-description">
            Level up your Mobile Legends skills with pro strategies, hero guides, and tournament-winning tactics!
          </p>
          <div className="hero-buttons">
            {/* ✅ "Watch YouTube" button → opens YouTube channel */}
            <a
              href="https://www.youtube.com/@PMCGaming8"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="hero-btn hero-btn-primary">
                <FaYoutube className="me-2" /> WATCH YOUTUBE
              </button>
            </a>

            {/* ✅ "Tutorials" button → goes to /tutorials page */}
            <Link to="/tutorials">
              <button className="hero-btn hero-btn-secondary">
                <FaGamepad className="me-2" /> TUTORIALS
              </button>
            </Link>
          </div>

          {/* ✅ Scroll arrow — fixed spacing so it doesn't overlap text */}
          <div className="hero-scroll-indicator">
            <span>▼</span>
          </div>
        </div>
      </div>

      <Container>

        {/* ✅ YOUTUBE CHANNEL BANNER — live subscriber count */}
        <div className="yt-banner">
          <div className="yt-banner-left">
            <FaYoutube className="yt-banner-icon" />
            <div className="yt-banner-info">
              <span className="yt-banner-name">PMC Gaming</span>
              <span className="yt-banner-handle">@PMCGaming8</span>
            </div>
          </div>
          <div className="yt-banner-center">
            <div className="yt-banner-stat">
              <span className="yt-banner-count">
                {loadingSubs ? '...' : (subscriberCount || '—')}
              </span>
              <span className="yt-banner-stat-label">SUBSCRIBERS</span>
            </div>
          </div>
          <div className="yt-banner-right">
            <a
              href="https://www.youtube.com/@PMCGaming8"
              target="_blank"
              rel="noopener noreferrer"
              className="yt-subscribe-btn"
            >
              <FaYoutube className="me-2" /> SUBSCRIBE
            </a>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="stats-dark">
          <div className="stat-dark-card">
            <FaVideo className="stat-dark-icon" />
            <div className="stat-dark-number">50+</div>
            <div className="stat-dark-label">VIDEO TUTORIALS</div>
          </div>
          <div className="stat-dark-card">
            <FaGamepad className="stat-dark-icon" />
            <div className="stat-dark-number">30+</div>
            <div className="stat-dark-label">HERO GUIDES</div>
          </div>
          <div className="stat-dark-card">
            <FaUsers className="stat-dark-icon" />
            <div className="stat-dark-number">10k+</div>
            <div className="stat-dark-label">ACTIVE PLAYERS</div>
          </div>
          <div className="stat-dark-card">
            <FaCrown className="stat-dark-icon" />
            <div className="stat-dark-number">100+</div>
            <div className="stat-dark-label">PRO TIPS</div>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <h2 className="section-title-dark">
          <FaFire className="title-fire" /> CHOOSE YOUR PATH <FaFire className="title-fire" />
        </h2>

        <Row className="g-4 mb-5">
          <Col md={4}>
            <div className="feature-dark-card">
              <div className="feature-dark-icon"><FaVideo /></div>
              <h3 className="feature-dark-title">HERO GUIDES</h3>
              <p className="feature-dark-text">Master every hero with frame-perfect combos and pro gameplay analysis</p>
              <Link to="/tutorials">
                <button className="feature-dark-btn">TRAIN NOW →</button>
              </Link>
            </div>
          </Col>
          <Col md={4}>
            <div className="feature-dark-card">
              <div className="feature-dark-icon"><FaTrophy /></div>
              <h3 className="feature-dark-title">PRO STRATEGIES</h3>
              <p className="feature-dark-text">Tournament-winning tactics and decision-making from pro players</p>
              <Link to="/tutorials">
                <button className="feature-dark-btn">MASTER NOW →</button>
              </Link>
            </div>
          </Col>
          <Col md={4}>
            <div className="feature-dark-card">
              <div className="feature-dark-icon"><FaUsers /></div>
              <h3 className="feature-dark-title">TEAM TACTICS</h3>
              <p className="feature-dark-text">Perfect team composition and coordination for ranked games</p>
              <Link to="/tutorials">
                <button className="feature-dark-btn">FORM TEAM →</button>
              </Link>
            </div>
          </Col>
        </Row>

        {/* CTA SECTION */}
        <div className="cta-dark">
          <div className="cta-dark-content text-center">
            <h2 className="cta-dark-title">READY TO DOMINATE?</h2>
            <div className="cta-dark-badge">⚡ SEASON 32 ⚡</div>
            <p className="cta-dark-text">Join thousands of players who already improved their rank using our guides</p>
            <Link to="/tutorials">
              <button className="cta-dark-btn">
                <FaGamepad className="me-2" /> START YOUR JOURNEY
              </button>
            </Link>
            <div className="cta-dark-players">
              <FaFire /> 1,234 PLAYERS ONLINE <FaFire />
            </div>
          </div>
        </div>

      </Container>
    </Container>
  )
}

export default Home
