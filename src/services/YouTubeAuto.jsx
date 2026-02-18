import React, { useState, useEffect } from 'react'
import { Container, Card, Spinner, Alert, Button, Row, Col } from 'react-bootstrap'
import { FaYoutube, FaSync, FaCheck, FaExclamationTriangle } from 'react-icons/fa'
import { fetchYouTubeVideos, testYouTubeAPI } from '../services/youtubeService'
import { database } from '../firebase'
import { ref, set, get } from 'firebase/database'

function YouTubeAuto() {
  const [loading, setLoading] = useState(false)
  const [lastSync, setLastSync] = useState('')
  const [message, setMessage] = useState('')
  const [videosFound, setVideosFound] = useState(0)
  const [newVideos, setNewVideos] = useState(0)
  const [apiStatus, setApiStatus] = useState(null)

  // Test API connection on load
  useEffect(() => {
    const testAPI = async () => {
      const isWorking = await testYouTubeAPI()
      setApiStatus(isWorking)
    }
    testAPI()
  }, [])

  const syncWithYouTube = async () => {
    setLoading(true)
    setMessage('')
    setNewVideos(0)
    
    try {
      // Fetch videos from YouTube
      const videos = await fetchYouTubeVideos()
      setVideosFound(videos.length)
      
      let addedCount = 0
      
      // Save each video to Firebase
      for (const video of videos) {
        const videoRef = ref(database, `tutorials/${video.id}`)
        const snapshot = await get(videoRef)
        
        // Check if video already exists
        if (!snapshot.exists()) {
          await set(videoRef, {
            title: video.title,
            description: video.description.substring(0, 200) + (video.description.length > 200 ? '...' : ''),
            thumbnail: video.thumbnail,
            youtubeUrl: video.embedUrl,
            category: 'Auto Upload',
            date: video.publishedAt.split('T')[0],
            autoImported: true,
            importDate: new Date().toISOString()
          })
          addedCount++
        }
      }
      
      setNewVideos(addedCount)
      setLastSync(new Date().toLocaleString())
      setMessage(`✅ Sync complete! Found ${videos.length} videos, added ${addedCount} new.`)
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`)
    }
    
    setLoading(false)
  }

  // Auto-sync every hour
  useEffect(() => {
    syncWithYouTube()
    const interval = setInterval(syncWithYouTube, 3600000) // 1 hour
    return () => clearInterval(interval)
  }, [])

  return (
    <Container>
      <Card className="youtube-auto-card">
        <Card.Header className="bg-danger text-white">
          <h4 className="mb-0">
            <FaYoutube className="me-2" /> YouTube Auto Upload
          </h4>
        </Card.Header>
        <Card.Body>
          {/* API Status */}
          {apiStatus !== null && (
            <Alert variant={apiStatus ? 'success' : 'warning'} className="mb-3">
              {apiStatus ? (
                <><FaCheck className="me-2" /> YouTube API Connected Successfully</>
              ) : (
                <><FaExclamationTriangle className="me-2" /> YouTube API Connection Issue - Check API Key</>
              )}
            </Alert>
          )}
          
          {message && (
            <Alert variant={message.includes('✅') ? 'success' : 'danger'}>
              {message}
            </Alert>
          )}
          
          <Row className="align-items-center">
            <Col md={6}>
              <Button
                variant="danger"
                onClick={syncWithYouTube}
                disabled={loading}
                className="w-100"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Syncing with YouTube...
                  </>
                ) : (
                  <>
                    <FaSync className="me-2" /> Sync Now
                  </>
                )}
              </Button>
            </Col>
            <Col md={6}>
              {lastSync && (
                <p className="text-muted mb-0">
                  Last sync: {lastSync}
                </p>
              )}
            </Col>
          </Row>
          
          {(videosFound > 0 || newVideos > 0) && (
            <div className="mt-3 text-center">
              <p className="mb-1">
                <strong className="text-danger">{videosFound}</strong> videos on YouTube
              </p>
              {newVideos > 0 && (
                <p className="text-success">
                  ✨ {newVideos} new videos added to site!
                </p>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default YouTubeAuto