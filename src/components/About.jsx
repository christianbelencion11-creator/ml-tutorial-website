import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { FaUsers, FaVideo, FaTrophy, FaHeart, FaGamepad, FaFire, FaYoutube } from 'react-icons/fa'

function About() {
  return (
    <Container>

      {/* Header */}
      <div className="text-center mb-5 mt-3">
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '3px' }}>
          ABOUT <span style={{ color: '#ff0000' }}>PMC GAMING</span>
        </h1>
        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #ff0000, transparent)', margin: '1rem auto', maxWidth: '300px' }} />
        <p style={{ color: '#888', fontSize: '0.95rem', fontFamily: 'Courier New', maxWidth: '600px', margin: '0 auto' }}>
          Dedicated to helping Mobile Legends players improve their gameplay and reach their full potential.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-dark mb-5">
        <div className="stat-dark-card">
          <FaUsers className="stat-dark-icon" />
          <div className="stat-dark-number">10k+</div>
          <div className="stat-dark-label">ACTIVE PLAYERS</div>
        </div>
        <div className="stat-dark-card">
          <FaVideo className="stat-dark-icon" />
          <div className="stat-dark-number">50+</div>
          <div className="stat-dark-label">VIDEO TUTORIALS</div>
        </div>
        <div className="stat-dark-card">
          <FaTrophy className="stat-dark-icon" />
          <div className="stat-dark-number">100+</div>
          <div className="stat-dark-label">PRO TIPS</div>
        </div>
        <div className="stat-dark-card">
          <FaHeart className="stat-dark-icon" />
          <div className="stat-dark-number">5+</div>
          <div className="stat-dark-label">YEARS EXPERIENCE</div>
        </div>
      </div>

      {/* Mission */}
      <Row className="g-4 mb-5">
        <Col md={6}>
          <div className="feature-dark-card" style={{ textAlign: 'left' }}>
            <div className="feature-dark-icon" style={{ margin: '0 0 1.2rem 0' }}>
              <FaFire />
            </div>
            <h3 className="feature-dark-title">OUR MISSION</h3>
            <p className="feature-dark-text">
              To provide high-quality, accessible Mobile Legends tutorials that help players
              of all skill levels improve their gameplay, understand advanced strategies,
              and enjoy the game more.
            </p>
          </div>
        </Col>
        <Col md={6}>
          <div className="feature-dark-card" style={{ textAlign: 'left' }}>
            <div className="feature-dark-icon" style={{ margin: '0 0 1.2rem 0' }}>
              <FaGamepad />
            </div>
            <h3 className="feature-dark-title">WHAT WE OFFER</h3>
            <p className="feature-dark-text">
              Hero guides, build recommendations, pro strategies, team tactics, and
              tournament-level tips — all from experienced players who know the game inside out.
            </p>
          </div>
        </Col>
      </Row>

      {/* YouTube CTA */}
      <div className="cta-dark mb-5">
        <div className="cta-dark-content text-center">
          <h2 className="cta-dark-title">WATCH US ON YOUTUBE</h2>
          <p className="cta-dark-text">Subscribe to PMC Gaming for the latest tutorials and gameplay videos!</p>
          <a href="https://www.youtube.com/@PMCGaming8" target="_blank" rel="noopener noreferrer">
            <button className="cta-dark-btn">
              <FaYoutube className="me-2" /> @PMCGaming8
            </button>
          </a>
        </div>
      </div>

    </Container>
  )
}

export default About