import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

function TutorialDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tutorial, setTutorial] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('mlbb_tutorials')
    if (saved) {
      const tutorials = JSON.parse(saved)
      const found = tutorials.find(t => t.id === parseInt(id))
      setTutorial(found)
    }
  }, [id])

  if (!tutorial) {
    return <div className="text-center">Loading...</div>
  }

  return (
    <Container>
      <Button 
        variant="outline-light" 
        onClick={() => navigate('/tutorials')}
        className="mb-4"
      >
        <FaArrowLeft /> Back to Tutorials
      </Button>

      <div className="glow-card">
        <h1 className="mb-4">{tutorial.title}</h1>
        
        <div className="video-container">
          <iframe
            src={tutorial.youtubeUrl}
            title={tutorial.title}
            allowFullScreen
          />
        </div>

        <Row className="mt-4">
          <Col md={8}>
            <h3>Description</h3>
            <p>{tutorial.description}</p>
          </Col>
          <Col md={4}>
            <div className="contact-info">
              <p><strong>Category:</strong> {tutorial.category}</p>
              <p><strong>Date Added:</strong> {tutorial.date}</p>
              <p><strong>Video ID:</strong> {id}</p>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  )
}

export default TutorialDetail