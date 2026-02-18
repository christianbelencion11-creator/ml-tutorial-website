import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { FaUsers, FaVideo, FaTrophy, FaHeart } from 'react-icons/fa'

function About() {
  return (
    <Container>
      <div className="glow-card">
        <h2 className="text-center mb-4">About MLBB Academy</h2>
        
        <p className="lead text-center mb-5">
          We're dedicated to helping Mobile Legends players improve their gameplay 
          and reach their full potential.
        </p>

        <Row className="g-4 mb-5">
          <Col md={3}>
            <div className="stat-box">
              <FaUsers className="display-4 text-danger mb-3" />
              <div className="stat-number">10k+</div>
              <div className="stat-label">Active Students</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-box">
              <FaVideo className="display-4 text-warning mb-3" />
              <div className="stat-number">50+</div>
              <div className="stat-label">Video Tutorials</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-box">
              <FaTrophy className="display-4 text-info mb-3" />
              <div className="stat-number">100+</div>
              <div className="stat-label">Pro Tips</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="stat-box">
              <FaHeart className="display-4 text-success mb-3" />
              <div className="stat-number">5+</div>
              <div className="stat-label">Years Experience</div>
            </div>
          </Col>
        </Row>

        <h3 className="text-center mb-4">Our Mission</h3>
        <p>
          To provide high-quality, accessible Mobile Legends tutorials that help players 
          of all skill levels improve their gameplay, understand advanced strategies, 
          and enjoy the game more.
        </p>
      </div>
    </Container>
  )
}

export default About