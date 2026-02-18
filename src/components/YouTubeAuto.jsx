import React, { useState, useEffect } from 'react'
import { Card, Spinner, Alert, Button, Row, Col } from 'react-bootstrap'
import { FaYoutube, FaSync, FaCheck, FaExclamationTriangle, FaVideo, FaClock } from 'react-icons/fa'
import { fetchYouTubeVideos, testYouTubeAPI } from '../services/youtubeService'
import { database } from '../firebase'
import { ref, set, get } from 'firebase/database'

function YouTubeAuto() {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [lastSync, setLastSync] = useState('')
  const [message, setMessage] = useState('')
  const [videosFound, setVideosFound] = useState(0)
  const [newVideos, setNewVideos] = useState(0)
  const [apiStatus, setApiStatus] = useState(null)
  const [syncHistory, setSyncHistory] = useState([])

  // Test API connection on load
  useEffect(() => {
    const testAPI = async () => {
      const isWorking = await testYouTubeAPI()
      setApiStatus(isWorking)
      setInitialLoading(false)
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
      let skippedCount = 0
      let errorCount = 0
      
      // Save each video to Firebase
      for (const video of videos) {
        try {
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
              importDate: new Date().toISOString(),
              videoId: video.id
            })
            addedCount++
          } else {
            skippedCount++
          }
        } catch (error) {
          console.error(`Error saving video ${video.id}:`, error)
          errorCount++
        }
      }
      
      setNewVideos(addedCount)
      
      const syncTime = new Date().toLocaleString()
      setLastSync(syncTime)
      
      // Add to sync history
      setSyncHistory(prev => [
        {
          time: syncTime,
          found: videos.length,
          added: addedCount,
          skipped: skippedCount,
          errors: errorCount
        },
        ...prev.slice(0, 4) // Keep only last 5 syncs
      ])
      
      let successMessage = `✅ Sync complete! Found ${videos.length} videos, added ${addedCount} new.`
      if (skippedCount > 0) successMessage += ` Skipped ${skippedCount} existing.`
      if (errorCount > 0) successMessage += ` Errors: ${errorCount}.`
      
      setMessage(successMessage)
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`)
      console.error('Sync error:', error)
    }
    
    setLoading(false)
  }

  // Auto-sync every hour
  useEffect(() => {
    syncWithYouTube()
    const interval = setInterval(syncWithYouTube, 3600000) // 1 hour
    return () => clearInterval(interval)
  }, [])

  if (initialLoading) {
    return (
      <Card className="youtube-auto-card mb-4">
        <Card.Body className="text-center py-4">
          <Spinner animation="border" variant="danger" />
          <p className="mt-2">Checking YouTube API connection...</p>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className="youtube-auto-card mb-4">
      <Card.Header className="bg-danger text-white d-flex justify-content-between align-items-center">
        <h4 className="mb-0">
          <FaYoutube className="me-2" /> YouTube Auto Upload
        </h4>
        {apiStatus && (
          <span className="badge bg-success">
            <FaCheck className="me-1" /> Connected
          </span>
        )}
      </Card.Header>
      
      <Card.Body>
        {/* API Status Warning */}
        {apiStatus === false && (
          <Alert variant="warning" className="mb-3">
            <FaExclamationTriangle className="me-2" />
            <strong>YouTube API Connection Issue</strong>
            <p className="mb-0 mt-2">
              Please check your API key in the .env file. Auto-sync will not work until this is fixed.
            </p>
          </Alert>
        )}
        
        {/* Success/Error Message */}
        {message && (
          <Alert 
            variant={message.includes('✅') ? 'success' : 'danger'} 
            dismissible 
            onClose={() => setMessage('')}
            className="mb-3"
          >
            {message}
          </Alert>
        )}
        
        {/* Sync Controls */}
        <Row className="align-items-center mb-3">
          <Col md={6}>
            <Button
              variant="danger"
              onClick={syncWithYouTube}
              disabled={loading || !apiStatus}
              className="w-100"
              size="lg"
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
              <div className="text-md-end mt-2 mt-md-0">
                <small className="text-muted">
                  <FaClock className="me-1" /> Last sync: {lastSync}
                </small>
              </div>
            )}
          </Col>
        </Row>

        {/* Statistics */}
        {(videosFound > 0 || newVideos > 0) && (
          <Row className="mt-3 g-3">
            <Col sm={4}>
              <div className="text-center p-3 bg-dark rounded">
                <FaYoutube className="text-danger mb-2" size={24} />
                <h5 className="text-white mb-0">{videosFound}</h5>
                <small className="text-muted">YouTube Videos</small>
              </div>
            </Col>
            <Col sm={4}>
              <div className="text-center p-3 bg-dark rounded">
                <FaVideo className="text-success mb-2" size={24} />
                <h5 className="text-white mb-0">{newVideos}</h5>
                <small className="text-muted">Newly Added</small>
              </div>
            </Col>
            <Col sm={4}>
              <div className="text-center p-3 bg-dark rounded">
                <FaCheck className="text-info mb-2" size={24} />
                <h5 className="text-white mb-0">{videosFound - newVideos}</h5>
                <small className="text-muted">Already Exist</small>
              </div>
            </Col>
          </Row>
        )}

        {/* Sync History */}
        {syncHistory.length > 0 && (
          <div className="mt-4">
            <h6 className="text-muted mb-2">Recent Sync History</h6>
            <div className="sync-history">
              {syncHistory.map((sync, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary">
                  <small>{sync.time}</small>
                  <div>
                    <span className="badge bg-info me-1">{sync.found} found</span>
                    <span className="badge bg-success me-1">{sync.added} new</span>
                    {sync.errors > 0 && (
                      <span className="badge bg-danger">{sync.errors} errors</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Auto-sync Info */}
        <div className="mt-3 text-center">
          <small className="text-muted">
            <FaSync className="me-1" /> Auto-sync runs every hour
          </small>
        </div>
      </Card.Body>
    </Card>
  )
}

export default YouTubeAuto