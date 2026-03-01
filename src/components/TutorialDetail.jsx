import React, { useState, useEffect } from 'react'
import { Container, Spinner } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaCalendar, FaTag, FaPlay } from 'react-icons/fa'
import { database } from '../firebase'
import { ref, onValue } from 'firebase/database'

function TutorialDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tutorial, setTutorial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      setError('No tutorial ID provided')
      setLoading(false)
      return
    }

    const tutorialRef = ref(database, `tutorials/${id}`)
    onValue(tutorialRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setTutorial({ id, ...data })
        setError('')
      } else {
        setError('Tutorial not found')
      }
      setLoading(false)
    }, (err) => {
      console.error("Firebase error:", err)
      setError('Error loading tutorial')
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="danger" style={{ width: '2.5rem', height: '2.5rem' }} />
        <p className="mt-3" style={{ color: '#555', fontSize: '0.9rem' }}>Loading tutorial...</p>
      </Container>
    )
  }

  if (error || !tutorial) {
    return (
      <Container className="text-center py-5">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>
          {error || 'Tutorial not found'}
        </h4>
        <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '2rem' }}>
          This tutorial may have been removed or the link is invalid.
        </p>
        <button className="back-btn" onClick={() => navigate('/tutorials')}>
          <FaArrowLeft size={12} /> Back to Tutorials
        </button>
      </Container>
    )
  }

  const formattedDate = tutorial.date
    ? new Date(tutorial.date).toLocaleDateString('en-PH', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    : null

  return (
    <Container>
      <div className="tutorial-detail-wrapper">

        {/* Back button */}
        <button className="back-btn" onClick={() => navigate('/tutorials')}>
          <FaArrowLeft size={12} /> Back to Tutorials
        </button>

        {/* Category tag */}
        {tutorial.category && (
          <div>
            <span className="detail-category-tag">{tutorial.category}</span>
          </div>
        )}

        {/* Title */}
        <h1 className="tutorial-detail-title">{tutorial.title}</h1>

        {/* Meta row */}
        <div className="detail-meta-row">
          {formattedDate && (
            <span className="detail-meta-item">
              <FaCalendar size={11} /> {formattedDate}
            </span>
          )}
          {tutorial.autoImported && (
            <span className="detail-meta-item">
              <FaPlay size={11} /> Auto-imported from YouTube
            </span>
          )}
        </div>

        {/* Video Player */}
        <div className="video-container">
          {tutorial.youtubeUrl ? (
            <iframe
              src={tutorial.youtubeUrl}
              title={tutorial.title}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="video-iframe"
            />
          ) : (
            <div className="no-video-placeholder">
              <FaPlay size={32} style={{ color: '#333' }} />
              <p>No video available</p>
            </div>
          )}
        </div>

        {/* Description */}
        {tutorial.description && (
          <div className="detail-description-box">
            <p className="detail-description-heading">About this tutorial</p>
            <p className="detail-description-text">{tutorial.description}</p>
          </div>
        )}

      </div>
    </Container>
  )
}

export default TutorialDetail