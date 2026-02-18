import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FaPlay, FaUsers, FaVideo, FaTrophy, FaGamepad, FaSkull, FaBolt, FaFire, FaCrown } from 'react-icons/fa'

function Home() {
  return (
    <Container>
      {/* HERO SECTION - BLACK & RED */}
      <div className="hero-dark mb-5">
        <div className="hero-overlay-dark"></div>
        <div className="hero-content-dark text-center">
          <h1 className="title-dark">
            <span className="title-glow">PMC GAMING</span>
            <span className="title-sub">TUTORIALS</span>
          </h1>
          <p className="hero-text-dark">
            ⚔️ Level up your Mobile Legends skills with pro strategies, 
            hero guides, and tournament-winning tactics! ⚔️
          </p>
          <div className="hero-buttons-dark">
            <Button as={Link} to="/tutorials" className="btn-dark-primary">
              <FaBolt /> START TRAINING
            </Button>
            <Button as={Link} to="/about" className="btn-dark-secondary">
              <FaSkull /> JOIN BATTLE
            </Button>
          </div>
        </div>
      </div>

      {/* STATS SECTION - DARK CARDS */}
      <div className="stats-dark">
        <div className="stat-dark-card">
          <FaVideo className="stat-dark-icon" />
          <div className="stat-dark-number">50+</div>
          <div className="stat-dark-label">VIDEO TUTORIALS</div>
          <div className="stat-dark-line"></div>
        </div>
        <div className="stat-dark-card">
          <FaGamepad className="stat-dark-icon" />
          <div className="stat-dark-number">30+</div>
          <div className="stat-dark-label">HERO GUIDES</div>
          <div className="stat-dark-line"></div>
        </div>
        <div className="stat-dark-card">
          <FaUsers className="stat-dark-icon" />
          <div className="stat-dark-number">10k+</div>
          <div className="stat-dark-label">ACTIVE PLAYERS</div>
          <div className="stat-dark-line"></div>
        </div>
        <div className="stat-dark-card">
          <FaCrown className="stat-dark-icon" />
          <div className="stat-dark-number">100+</div>
          <div className="stat-dark-label">PRO TIPS</div>
          <div className="stat-dark-line"></div>
        </div>
      </div>

      {/* FEATURES SECTION - DARK CARDS */}
      <h2 className="section-title-dark">
        <FaFire className="title-fire" /> CHOOSE YOUR PATH <FaFire className="title-fire" />
      </h2>
      
      <Row className="g-4 mb-5">
        <Col md={4}>
          <div className="feature-dark-card">
            <div className="feature-dark-glow"></div>
            <div className="feature-dark-icon">
              <FaVideo />
            </div>
            <h3 className="feature-dark-title">HERO GUIDES</h3>
            <div className="feature-dark-divider"></div>
            <p className="feature-dark-text">Master every hero with frame-perfect combos and pro gameplay analysis</p>
            <div className="feature-dark-stats">
              <span>⚡ 15+ HOURS</span>
              <span>⚔️ ALL ROLES</span>
            </div>
            <Button as={Link} to="/tutorials" className="feature-dark-btn">
              TRAIN NOW →
            </Button>
          </div>
        </Col>

        <Col md={4}>
          <div className="feature-dark-card">
            <div className="feature-dark-glow"></div>
            <div className="feature-dark-icon">
              <FaTrophy />
            </div>
            <h3 className="feature-dark-title">PRO STRATEGIES</h3>
            <div className="feature-dark-divider"></div>
            <p className="feature-dark-text">Tournament-winning tactics and decision-making from pro players</p>
            <div className="feature-dark-stats">
              <span>🏆 MPL LEVEL</span>
              <span>🛡️ TEAM PLAYS</span>
            </div>
            <Button as={Link} to="/tutorials" className="feature-dark-btn">
              MASTER NOW →
            </Button>
          </div>
        </Col>

        <Col md={4}>
          <div className="feature-dark-card">
            <div className="feature-dark-glow"></div>
            <div className="feature-dark-icon">
              <FaUsers />
            </div>
            <h3 className="feature-dark-title">TEAM TACTICS</h3>
            <div className="feature-dark-divider"></div>
            <p className="feature-dark-text">Perfect team composition and coordination for ranked games</p>
            <div className="feature-dark-stats">
              <span>🤝 5-MAN STRATS</span>
              <span>⚡ COMBO SETUPS</span>
            </div>
            <Button as={Link} to="/tutorials" className="feature-dark-btn">
              FORM TEAM →
            </Button>
          </div>
        </Col>
      </Row>

      {/* CTA SECTION - DARK */}
      <div className="cta-dark">
        <div className="cta-dark-overlay"></div>
        <div className="cta-dark-content text-center">
          <h2 className="cta-dark-title">READY TO DOMINATE?</h2>
          <div className="cta-dark-badge">⚡ SEASON 32 ⚡</div>
          <p className="cta-dark-text">Join thousands of players who already improved their rank using our guides</p>
          <Button as={Link} to="/tutorials" className="cta-dark-btn">
            <FaGamepad /> START YOUR JOURNEY
          </Button>
          <div className="cta-dark-players">
            <FaFire /> 1,234 PLAYERS ONLINE <FaFire />
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Home