import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FaPlay, FaUsers, FaVideo, FaTrophy, FaGamepad, FaCrown, FaSkull, FaBolt } from 'react-icons/fa'

function Home() {
  return (
    <Container>
      {/* Hero Section with Gaming Background */}
      <div className="gaming-hero mb-5">
        <div className="hero-overlay"></div>
        <div className="hero-content text-center">
          <h1 className="gaming-title">
            <span className="glitch-text">PMC GAMING</span>
            <span className="tutorials-sub">TUTORIALS</span>
          </h1>
          <p className="gaming-lead">
            Level up your Mobile Legends skills with pro strategies, 
            hero guides, and tournament-winning tactics!
          </p>
          <div className="hero-buttons">
            <Button as={Link} to="/tutorials" className="gaming-btn primary">
              <FaBolt /> START TRAINING
            </Button>
            <Button as={Link} to="/about" className="gaming-btn secondary">
              <FaSkull /> JOIN THE BATTLE
            </Button>
          </div>
        </div>
      </div>

      {/* Gaming Stats Section */}
      <div className="gaming-stats-container">
        <div className="stat-card legendary">
          <FaVideo className="stat-icon" />
          <div className="stat-number">50+</div>
          <div className="stat-label">Video Tutorials</div>
          <div className="stat-rarity">LEGENDARY</div>
        </div>
        <div className="stat-card epic">
          <FaGamepad className="stat-icon" />
          <div className="stat-number">30+</div>
          <div className="stat-label">Hero Guides</div>
          <div className="stat-rarity">EPIC</div>
        </div>
        <div className="stat-card mythic">
          <FaUsers className="stat-icon" />
          <div className="stat-number">10k+</div>
          <div className="stat-label">Active Players</div>
          <div className="stat-rarity">MYTHIC</div>
        </div>
        <div className="stat-card immortal">
          <FaCrown className="stat-icon" />
          <div className="stat-number">100+</div>
          <div className="stat-label">Pro Strategies</div>
          <div className="stat-rarity">IMMORTAL</div>
        </div>
      </div>

      {/* Features Section - Gaming Cards */}
      <h2 className="section-title gaming">
        <span className="title-bg">⚡ CHOOSE YOUR PATH ⚡</span>
      </h2>
      
      <Row className="g-4 mb-5">
        <Col md={4}>
          <div className="gaming-feature-card assassin">
            <div className="card-glow"></div>
            <div className="feature-icon-container">
              <FaVideo className="feature-icon" />
            </div>
            <h3>HERO GUIDES</h3>
            <div className="feature-divider"></div>
            <p>Master every hero with frame-perfect combos, advanced techniques, and pro gameplay analysis</p>
            <div className="feature-stats">
              <span>🎯 15+ Hours</span>
              <span>⚔️ All Roles</span>
            </div>
            <Button as={Link} to="/tutorials" className="feature-btn">
              TRAIN NOW
            </Button>
          </div>
        </Col>

        <Col md={4}>
          <div className="gaming-feature-card tank">
            <div className="card-glow"></div>
            <div className="feature-icon-container">
              <FaTrophy className="feature-icon" />
            </div>
            <h3>PRO STRATEGIES</h3>
            <div className="feature-divider"></div>
            <p>Tournament-winning tactics, rotation patterns, and decision-making from pro players</p>
            <div className="feature-stats">
              <span>🏆 MPL Level</span>
              <span>🛡️ Team Tactics</span>
            </div>
            <Button as={Link} to="/tutorials" className="feature-btn">
              MASTER NOW
            </Button>
          </div>
        </Col>

        <Col md={4}>
          <div className="gaming-feature-card mage">
            <div className="card-glow"></div>
            <div className="feature-icon-container">
              <FaUsers className="feature-icon" />
            </div>
            <h3>TEAM TACTICS</h3>
            <div className="feature-divider"></div>
            <p>Perfect your team composition, coordination, and synergy for ranked games</p>
            <div className="feature-stats">
              <span>🤝 5-Man Strats</span>
              <span>⚡ Combo Setups</span>
            </div>
            <Button as={Link} to="/tutorials" className="feature-btn">
              FORM TEAM
            </Button>
          </div>
        </Col>
      </Row>

      {/* CTA Section - Gaming Style */}
      <div className="gaming-cta">
        <div className="cta-background"></div>
        <div className="cta-content text-center">
          <h2>READY TO DOMINATE?</h2>
          <div className="cta-timer">
            <span>⚡ SEASON 32 ⚡</span>
          </div>
          <p className="cta-text">Join thousands of players who already improved their rank using our guides</p>
          <Button as={Link} to="/tutorials" className="cta-gaming-btn">
            <FaGamepad /> START YOUR JOURNEY
          </Button>
          <div className="cta-players">
            <span>🔥 1,234 players online</span>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Home