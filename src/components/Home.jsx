import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FaPlay, FaUsers, FaVideo, FaTrophy } from 'react-icons/fa'

function Home() {
  return (
    <Container>
      {/* Hero Section */}
      <div className="glow-card text-center mb-5">
        <h1 className="display-3 mb-4">Welcome to MLBB Academy</h1>
        <p className="lead mb-4">
          Your ultimate destination for Mobile Legends: Bang Bang tutorials, 
          tips, and strategies from pro players!
        </p>
        <Button as={Link} to="/tutorials" variant="primary" size="lg" className="me-3">
          <FaPlay /> Start Learning
        </Button>
        <Button as={Link} to="/about" variant="outline-light" size="lg">
          Learn More
        </Button>
      </div>

      {/* Stats Section */}
      <div className="stats-container">
        <div className="stat-box">
          <div className="stat-number">50+</div>
          <div className="stat-label">Video Tutorials</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">30+</div>
          <div className="stat-label">Hero Guides</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">10k+</div>
          <div className="stat-label">Students</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">100+</div>
          <div className="stat-label">Pro Tips</div>
        </div>
      </div>

      {/* Features Section */}
      <h2 className="text-center mb-4">What You'll Learn</h2>
      <Row className="g-4">
        <Col md={4}>
          <div className="tutorial-card">
            <div className="p-4 text-center">
              <FaVideo className="display-1 text-danger mb-3" />
              <h3>Hero Guides</h3>
              <p>In-depth tutorials for every hero, including combos and playstyles</p>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="tutorial-card">
            <div className="p-4 text-center">
              <FaTrophy className="display-1 text-warning mb-3" />
              <h3>Pro Strategies</h3>
              <p>Advanced tactics used by professional players</p>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="tutorial-card">
            <div className="p-4 text-center">
              <FaUsers className="display-1 text-info mb-3" />
              <h3>Team Tactics</h3>
              <p>Master team composition and coordination</p>
            </div>
          </div>
        </Col>
      </Row>

      {/* CTA Section */}
      <div className="glow-card text-center mt-5">
        <h2>Ready to Become a Pro?</h2>
        <p className="lead">Join thousands of players who improved their gameplay</p>
        <Button as={Link} to="/tutorials" variant="primary" size="lg">
          Start Watching Now
        </Button>
      </div>
    </Container>
  )
}

export default Home