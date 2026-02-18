import React, { useState, useEffect } from 'react'
import { Container, Button, Spinner } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaPlay, FaCalendar, FaTag } from 'react-icons/fa'
import { database } from '../firebase'
import { ref, onValue } from 'firebase/database'

function TutorialDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tutorial, setTutorial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    console.log("Tutorial ID from URL:", id) // Check if ID is received
    
    if (!id) {
      setError('No tutorial ID provided')
      setLoading(false)
      return
    }

    const tutorialRef = ref(database, `tutorials/${id}`)
    
    onValue(tutorialRef, (snapshot) => {
      const data = snapshot.val()
      console.log("Firebase data for ID:", id, data) // Check if data is retrieved
      
      if (data) {
        setTutorial({ id, ...data })
        setError('')
      } else {
        setError('Tutorial not found')
      }
      setLoading(false)
    }, (error) => {
      console.error("Firebase error:", error)
      setError('Error loading tutorial')
      setLoading(false)
    })
  }, [id])

  const handleGoBack = () => {
    navigate('/tutorials')
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="danger" />
        <p className="mt-3">Loading tutorial...</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <h3 className="text-danger mb-4">❌ {error}</h3>
        <Button variant="danger" onClick={handleGoBack}>
          <FaArrowLeft className="me-2" /> Back to Tutorials
        </Button>
      </Container>
    )
  }

  if (!tutorial) {
    return (
      <Container className="text-center py-5">
        <h3 className="text-danger mb-4">Tutorial not found</h3>
        <Button variant="danger" onClick={handleGoBack}>
          <FaArrowLeft className="me-2" /> Back to Tutorials
        </Button>
      </Container>
    )
  }

  return (
    <Container>
      <Button 
        variant="outline-danger" 
        onClick={handleGoBack}
        className="mb-4"
      >
        <FaArrowLeft className="me-2" /> Back to Tutorials
      </Button>

      <div className="tutorial-detail-card">
        <h1 className="tutorial-detail-title">{tutorial.title}</h1>
        
        <div className="tutorial-meta-info mb-4">
          <span className="me-4">
            <FaTag className="text-danger me-2" /> {tutorial.category}
          </span>
          <span>
            <FaCalendar className="text-danger me-2" /> {tutorial.date}
          </span>
        </div>
        
        <div className="video-container">
          {tutorial.youtubeUrl ? (
            <iframe
              src={tutorial.youtubeUrl}
              title={tutorial.title}
              allowFullScreen
              className="video-iframe"
            />
          ) : (
            <div className="no-video-placeholder">
              <p>No video URL provided</p>
            </div>
          )}
        </div>

        <div className="tutorial-description mt-4">
          <h3>Description</h3>
          <p>{tutorial.description}</p>
        </div>
      </div>
    </Container>
  )
}

export default TutorialDetail