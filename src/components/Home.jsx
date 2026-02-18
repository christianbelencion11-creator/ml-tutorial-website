import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FaPlay, FaUsers, FaVideo, FaTrophy, FaGamepad, FaSkull, FaBolt, FaFire, FaCrown } from 'react-icons/fa'

function Home() {
  return (
    <Container fluid className="home-container p-0">
      {/* HERO SECTION - WITH BACKGROUND IMAGE */}
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
            <Link to="/tutorials">
              <button className="hero-btn hero-btn-primary">
                <FaBolt className="me-2" /> START TRAINING
              </button>
            </Link>
            <Link to="/about">
              <button className="hero-btn hero-btn-secondary">
                <FaSkull className="me-2" /> JOIN BATTLE
              </button>
            </Link>
          </div>
          <div className="hero-scroll-indicator">
            <span>▼</span>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <Container>
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
              <div className="feature-dark-icon">
                <FaVideo />
              </div>
              <h3 className="feature-dark-title">HERO GUIDES</h3>
              <p className="feature-dark-text">Master every hero with frame-perfect combos and pro gameplay analysis</p>
              <Link to="/tutorials">
                <button className="feature-dark-btn">TRAIN NOW →</button>
              </Link>
            </div>
          </Col>

          <Col md={4}>
            <div className="feature-dark-card">
              <div className="feature-dark-icon">
                <FaTrophy />
              </div>
              <h3 className="feature-dark-title">PRO STRATEGIES</h3>
              <p className="feature-dark-text">Tournament-winning tactics and decision-making from pro players</p>
              <Link to="/tutorials">
                <button className="feature-dark-btn">MASTER NOW →</button>
              </Link>
            </div>
          </Col>

          <Col md={4}>
            <div className="feature-dark-card">
              <div className="feature-dark-icon">
                <FaUsers />
              </div>
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