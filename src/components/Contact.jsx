import React, { useState } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
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
      <div className="text-center mb-5 mt-3">
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '3px' }}>
          CONTACT <span style={{ color: '#ff0000' }}>US</span>
        </h1>
        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #ff0000, transparent)', margin: '1rem auto', maxWidth: '200px' }} />
        <p style={{ color: '#888', fontSize: '0.95rem', fontFamily: 'Courier New' }}>Got questions? We're here to help you level up!</p>
      </div>

      {showAlert && (
        <div style={{ background: '#0a1a0a', border: '1px solid #22c55e', color: '#22c55e', padding: '12px', textAlign: 'center', marginBottom: '1.5rem', borderRadius: '6px' }}>
          ✅ Message sent! We'll get back to you soon.
        </div>
      )}

      <Row className="g-4 mb-5">
        <Col lg={4} md={5}>
          <div className="feature-dark-card" style={{ textAlign: 'left', height: 'auto' }}>
            <h3 className="feature-dark-title mb-4">GET IN TOUCH</h3>
            {[
              { icon: <FaYoutube />, label: 'YOUTUBE', value: '@PMCGaming8' },
              { icon: <FaEnvelope />, label: 'EMAIL', value: 'pmcgamingp@gmail.com' },
              { icon: <FaMapMarkerAlt />, label: 'LOCATION', value: 'Philippines' },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '1.5rem' }}>
                <div style={{ width: '40px', height: '40px', background: '#1a0000', border: '1px solid #ff0000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#ff0000' }}>
                  {icon}
                </div>
                <div>
                  <div style={{ color: '#ff0000', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '3px' }}>{label}</div>
                  <div style={{ color: '#aaa', fontSize: '0.88rem', fontFamily: 'Courier New' }}>{value}</div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
              <a href="https://www.youtube.com/@PMCGaming8" target="_blank" rel="noopener noreferrer" className="footer-social-btn"><FaYoutube /></a>
              <a href="https://www.facebook.com/realpmcgaming" target="_blank" rel="noopener noreferrer" className="footer-social-btn"><FaFacebook /></a>
            </div>
            <div style={{ marginTop: '1.5rem', background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '12px', borderLeft: '3px solid #ff0000' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4444', fontSize: '0.72rem', fontWeight: 900, letterSpacing: '1px', marginBottom: '4px' }}>
                <FaCommentDots /> LIVE CHAT
              </div>
              <p style={{ color: '#555', fontSize: '0.78rem', fontFamily: 'Courier New', margin: 0 }}>Use the chat bubble (bottom of screen) for instant support!</p>
            </div>
          </div>
        </Col>

        <Col lg={8} md={7}>
          <div className="feature-dark-card" style={{ textAlign: 'left', height: 'auto' }}>
            <h3 className="feature-dark-title mb-4">SEND A MESSAGE</h3>
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: '#ff0000', fontSize: '0.72rem', fontWeight: 900, letterSpacing: '2px' }}>NAME</Form.Label>
                    <Form.Control type="text" placeholder="Your name" value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} required
                      style={{ background: '#0d0d0d', border: '1px solid #222', color: '#ddd', borderRadius: '6px', padding: '10px 14px' }} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: '#ff0000', fontSize: '0.72rem', fontWeight: 900, letterSpacing: '2px' }}>EMAIL</Form.Label>
                    <Form.Control type="email" placeholder="your@email.com" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} required
                      style={{ background: '#0d0d0d', border: '1px solid #222', color: '#ddd', borderRadius: '6px', padding: '10px 14px' }} />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={{ color: '#ff0000', fontSize: '0.72rem', fontWeight: 900, letterSpacing: '2px' }}>MESSAGE</Form.Label>
                    <Form.Control as="textarea" rows={6} placeholder="Ask us anything about MLBB..." value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })} required
                      style={{ background: '#0d0d0d', border: '1px solid #222', color: '#ddd', borderRadius: '6px', padding: '10px 14px', resize: 'none' }} />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <button type="submit" style={{ background: '#ff0000', border: 'none', color: '#fff', padding: '12px 32px', fontWeight: 900, fontSize: '0.88rem', letterSpacing: '2px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#cc0000'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#ff0000'}>
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