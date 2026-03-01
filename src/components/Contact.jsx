import React, { useState } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import { FaEnvelope, FaMapMarkerAlt, FaYoutube, FaFacebook, FaCommentDots } from 'react-icons/fa'

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  // Open chat widget and pre-fill message
  const handleSendViaChat = (e) => {
    e.preventDefault()
    if (!formData.message.trim()) return

    // Store the message to be picked up by ChatWidget
    const preMsg = `[Contact Form] Name: ${formData.name || 'Anonymous'} | Email: ${formData.email || 'N/A'} | Message: ${formData.message}`
    sessionStorage.setItem('pmc_prefill_message', preMsg)

    // Trigger chat open - dispatch custom event
    window.dispatchEvent(new CustomEvent('pmc_open_chat', { detail: { message: preMsg } }))
    setSent(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div style={{ background: '#000', minHeight: '80vh', color: '#fff', paddingTop: '1rem', paddingBottom: '3rem' }}>
      <Container>

        {/* Header */}
        <div className="text-center mb-5">
          <div style={{ display: 'inline-block', position: 'relative' }}>
            <h1 style={{
              fontSize: '2.2rem', fontWeight: 900, letterSpacing: '4px',
              color: '#fff', margin: 0, textShadow: '0 0 30px rgba(255,0,0,0.3)'
            }}>
              CONTACT <span style={{ color: '#ff0000' }}>US</span>
            </h1>
            <div style={{
              height: '3px', background: 'linear-gradient(90deg, transparent, #ff0000, transparent)',
              margin: '12px auto 0', width: '100%'
            }} />
          </div>
          <p style={{ color: '#555', fontSize: '0.88rem', fontFamily: 'Courier New', marginTop: '12px' }}>
            Got questions? We're here to help you level up your game!
          </p>
        </div>

        {sent && (
          <div style={{
            background: '#0a1a0a', border: '1px solid #22c55e', color: '#22c55e',
            padding: '12px 20px', textAlign: 'center', marginBottom: '2rem',
            borderRadius: '6px', fontSize: '0.88rem', letterSpacing: '1px'
          }}>
            ✅ Message sent via chat! Check the chat bubble (bottom of screen).
          </div>
        )}

        <Row className="g-4">
          {/* Left - Contact Info */}
          <Col lg={4} md={5}>
            <div style={{
              background: '#0d0d0d', border: '1px solid #1a1a1a',
              borderLeft: '3px solid #ff0000', padding: '2rem', height: '100%'
            }}>
              <h3 style={{ color: '#ff0000', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '3px', marginBottom: '2rem' }}>
                GET IN TOUCH
              </h3>

              {[
                { icon: <FaYoutube />, label: 'YOUTUBE', value: '@PMCGaming8', href: 'https://www.youtube.com/@PMCGaming8' },
                { icon: <FaEnvelope />, label: 'EMAIL', value: 'pmcgamingp@gmail.com', href: 'mailto:pmcgamingp@gmail.com' },
                { icon: <FaMapMarkerAlt />, label: 'LOCATION', value: 'Philippines', href: null },
              ].map(({ icon, label, value, href }) => (
                <div key={label} style={{ display: 'flex', gap: '14px', marginBottom: '1.8rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '42px', height: '42px', background: '#1a0000',
                    border: '1px solid #ff0000', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#ff0000', flexShrink: 0, fontSize: '1rem'
                  }}>{icon}</div>
                  <div>
                    <div style={{ color: '#ff0000', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '4px' }}>{label}</div>
                    {href
                      ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#aaa', fontSize: '0.85rem', fontFamily: 'Courier New', textDecoration: 'none' }}
                          onMouseOver={e => e.target.style.color = '#ff0000'}
                          onMouseOut={e => e.target.style.color = '#aaa'}>
                          {value}
                        </a>
                      : <div style={{ color: '#aaa', fontSize: '0.85rem', fontFamily: 'Courier New' }}>{value}</div>
                    }
                  </div>
                </div>
              ))}

              {/* Social */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
                <a href="https://www.youtube.com/@PMCGaming8" target="_blank" rel="noopener noreferrer" className="footer-social-btn"><FaYoutube /></a>
                <a href="https://www.facebook.com/realpmcgaming" target="_blank" rel="noopener noreferrer" className="footer-social-btn"><FaFacebook /></a>
              </div>

              {/* Chat tip */}
              <div style={{
                marginTop: '2rem', background: '#0a0a0a', border: '1px solid #1e1e1e',
                borderLeft: '3px solid #ff0000', padding: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4444', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '1.5px', marginBottom: '6px' }}>
                  <FaCommentDots /> LIVE CHAT
                </div>
                <p style={{ color: '#444', fontSize: '0.78rem', fontFamily: 'Courier New', margin: 0, lineHeight: 1.6 }}>
                  Tap the red chat bubble at the bottom of the screen for instant support!
                </p>
              </div>
            </div>
          </Col>

          {/* Right - Form */}
          <Col lg={8} md={7}>
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ color: '#ff0000', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '3px', margin: 0 }}>SEND A MESSAGE</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,0,0,0.06)', border: '1px solid rgba(255,0,0,0.15)', padding: '4px 10px', fontSize: '0.68rem', color: '#ff4444', letterSpacing: '1px' }}>
                  <FaCommentDots size={10} /> Sends via Live Chat
                </div>
              </div>

              <Form onSubmit={handleSendViaChat}>
                <Row className="g-3">
                  <Col md={6}>
                    <div style={{ marginBottom: '0' }}>
                      <label style={{ color: '#555', fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 900, display: 'block', marginBottom: '6px' }}>NAME</label>
                      <input type="text" value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name (optional)"
                        style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px', color: '#ddd', padding: '10px 14px', fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit' }}
                        onFocus={e => e.target.style.borderColor = '#ff0000'}
                        onBlur={e => e.target.style.borderColor = '#1e1e1e'}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div>
                      <label style={{ color: '#555', fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 900, display: 'block', marginBottom: '6px' }}>EMAIL</label>
                      <input type="email" value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com (optional)"
                        style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px', color: '#ddd', padding: '10px 14px', fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit' }}
                        onFocus={e => e.target.style.borderColor = '#ff0000'}
                        onBlur={e => e.target.style.borderColor = '#1e1e1e'}
                      />
                    </div>
                  </Col>
                  <Col md={12}>
                    <div>
                      <label style={{ color: '#555', fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 900, display: 'block', marginBottom: '6px' }}>MESSAGE <span style={{ color: '#ff0000' }}>*</span></label>
                      <textarea
                        rows={6} required value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Ask us anything about MLBB — hero guides, builds, strategies..."
                        style={{ width: '100%', background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px', color: '#ddd', padding: '10px 14px', fontSize: '0.88rem', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.6 }}
                        onFocus={e => e.target.style.borderColor = '#ff0000'}
                        onBlur={e => e.target.style.borderColor = '#1e1e1e'}
                      />
                    </div>
                  </Col>
                  <Col md={12}>
                    <button type="submit"
                      style={{ background: '#ff0000', border: 'none', color: '#000', padding: '12px 28px', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', fontFamily: 'inherit' }}
                      onMouseOver={e => { e.currentTarget.style.background = '#cc0000'; e.currentTarget.style.color = '#fff' }}
                      onMouseOut={e => { e.currentTarget.style.background = '#ff0000'; e.currentTarget.style.color = '#000' }}
                    >
                      <FaCommentDots /> SEND VIA CHAT
                    </button>
                    <p style={{ color: '#333', fontSize: '0.7rem', fontFamily: 'Courier New', marginTop: '8px' }}>
                      This will open the live chat and send your message directly.
                    </p>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Contact