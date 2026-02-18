import React, { useState } from 'react'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

function Contact() {
  const [showAlert, setShowAlert] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  return (
    <Container>
      <div className="glow-card">
        <h2 className="text-center mb-4">Contact Us</h2>
        
        {showAlert && (
          <Alert variant="success" className="text-center">
            Message sent successfully! We'll get back to you soon.
          </Alert>
        )}

        <Row>
          <Col md={5}>
            <div className="contact-info">
              <h4 className="mb-4">Get in Touch</h4>
              
              <div className="d-flex align-items-center mb-4">
                <FaEnvelope className="contact-icon" />
                <div>
                  <strong>Email</strong>
                  <p>support@mlbbacademy.com</p>
                </div>
              </div>

              <div className="d-flex align-items-center mb-4">
                <FaPhone className="contact-icon" />
                <div>
                  <strong>Phone</strong>
                  <p>+63 912 345 6789</p>
                </div>
              </div>

              <div className="d-flex align-items-center mb-4">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <strong>Address</strong>
                  <p>Cabuyao, Laguna, Philippines</p>
                </div>
              </div>
            </div>
          </Col>

          <Col md={7}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="form-group">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" required />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" required />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label>Message</Form.Label>
                <Form.Control as="textarea" rows={5} required />
              </Form.Group>

              <Button type="submit" variant="primary">
                Send Message
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    </Container>
  )
}

export default Contact