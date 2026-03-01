import React, { useState } from 'react'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { FaEnvelope, FaMapMarkerAlt, FaYoutube, FaFacebook, FaPaperPlane, FaCommentDots } from 'react-icons/fa'

function Contact() {
  const [showAlert, setShowAlert] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowAlert(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setShowAlert(false), 4000)
  }

  return (
    <Container>

      {/* Header */}
      <div className="text-center mb-5 mt-3">
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '3px' }}>
          CONTACT <span style={{ color: '#ff0000' }}>US</span>
        </h1>
        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #ff0000, transparent)', margin: '1rem auto', maxWidth: '200px' }} />
        <p style={{ color: '#888', fontSize: '0.95rem', fontFamily: 'Courier New' }}>
          Got questions? We're here to help you level up!
        </p>
      </div>

      {showAlert && (
        <Alert variant="success" className="text-center mb-4" style={{ background: '#0a1a0a', border: '1px solid #22c55e', color: '#22c55e' }}>
          ✅ Message sent! We'll get back to you soon.
        </Alert>
      )}

      <Row className="g-4 mb-5">

        {/* Contact Info */}
        <Col lg={4} md={5}>
          <div className="feature-dark-card" style={{ textAlign: 'left', height: 'auto' }}>
            <h3 className="feature-dark-title mb-4">GET IN TOUCH</h3>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', background: '#1a0000', border: '1px solid #ff0000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FaYoutube style={{ color: '#ff0000' }} />
              </div>
              <div>
                <div style={{ color: '#ff0000', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '3px' }}>YOUTUBE</div>
                <div style={{ color: '#aaa', fontSize: '0.88rem', fontFamily: 'Courier New' }}>@PMCGaming8</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', background: '#1a0000', border: '1px solid #ff0000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FaEnvelope style={{ color: '#ff0000' }} />
              </div>
              <div>
                <div style={{ color: '#ff0000', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '3px' }}>EMAIL</div>
                <div style={{ color: '#aaa', fontSize: '0.88rem', fontFamily: 'Courier New' }}>pmcgamingp@gmail.com</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', background: '#1a0000', border: '1px solid #ff0000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FaMapMarkerAlt style={{ color: '#ff0000' }} />
              </div>
              <div>
                <div style={{ color: '#ff0000', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '3px' }}>LOCATION</div>
                <div style={{ color: '#aaa', fontSize: '0.88rem', fontFamily: 'Courier New' }}>Philippines</div>
              </div>
            </div>

            {/* Social buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
              <a href="https://www.youtube.com/@PMCGaming8" target="_blank" rel="noopener noreferrer" className="footer-social-btn">
                <FaYoutube />
              </a>
              <a href="https://www.facebook.com/realpmcgaming" target="_blank" rel="noopener noreferrer" className="footer-social-btn">
                <FaFacebook />
              </a>
            </div>

            {/* Chat tip */}
            <div style={{ marginTop: '1.5rem', background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '12px', borderLeft: '3px solid #ff0000' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4444', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '1px', marginBottom: '4px' }}>
                <FaCommentDots /> LIVE CHAT
              </div>
              <p style={{ color: '#666', fontSize: '0.8rem', fontFamily: 'Courier New', margin: 0 }}>
                Use the chat button (bottom right) for instant support!
              </p>
            </div>
          </div>
        </Col>

        {/* Contact Form */}
        <Col lg={8} md={7}>
          <div className="feature-dark-card" style={{ textAlign: 'left', height: 'auto' }}>
            <h3 className="feature-dark-title mb-4">SEND A MESSAGE</h3>

            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: '#ff0000', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '2px' }}>NAME</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      style={{ background: '#0d0d0d', border: '1px solid #222', color: '#ddd', borderRadius: '6px', padding: '10px 14px' }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: '#ff0000', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '2px' }}>EMAIL</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      style={{ background: '#0d0d0d', border: '1px solid #222', color: '#ddd', borderRadius: '6px', padding: '10px 14px' }}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={{ color: '#ff0000', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '2px' }}>MESSAGE</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      placeholder="Ask us anything about MLBB tutorials..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                      style={{ background: '#0d0d0d', border: '1px solid #222', color: '#ddd', borderRadius: '6px', padding: '10px 14px', resize: 'none' }}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <button
                    type="submit"
                    style={{
                      background: '#ff0000', border: 'none', color: '#fff',
                      padding: '12px 32px', fontWeight: 900, fontSize: '0.9rem',
                      letterSpacing: '2px', borderRadius: '6px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#cc0000'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#ff0000'}
                  >
                    <FaPaperPlane /> SEND MESSAGE
                  </button>
                </Col>
              </Row>
            </Form>
          </div>
        </Col>
      </Row>

    </Container>
  )
}

export default Contact