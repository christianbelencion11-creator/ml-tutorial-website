import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FaPlay, FaSearch, FaFilter } from 'react-icons/fa'
import { database } from '../firebase'
import { ref, onValue } from 'firebase/database'

function Tutorials({ searchTerm }) {
  const navigate = useNavigate()
  const [tutorials, setTutorials] = useState([])
  const [filteredTutorials, setFilteredTutorials] = useState([])
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState(['all'])

  // Load tutorials from Firebase
  useEffect(() => {
    const tutorialsRef = ref(database, 'tutorials/')
    
    onValue(tutorialsRef, (snapshot) => {
      const data = snapshot.val()
      
      if (data) {
        // Convert Firebase object to array
        const tutorialsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }))
        
        // Sort by date (newest first)
        tutorialsArray.sort((a, b) => new Date(b.date) - new Date(a.date))
        
        setTutorials(tutorialsArray)
        
        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(tutorialsArray.map(t => t.category).filter(Boolean))]
        setCategories(uniqueCategories)
      } else {
        setTutorials([])
      }
      setLoading(false)
    }, (error) => {
      console.error("Firebase error:", error)
      setLoading(false)
    })
  }, [])

  // Filter tutorials based on search term and category
  useEffect(() => {
    let filtered = tutorials

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tutorial => 
        (tutorial.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (tutorial.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (tutorial.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(tutorial => tutorial.category === category)
    }

    setFilteredTutorials(filtered)
  }, [searchTerm, category, tutorials])

  const handleTutorialClick = (tutorialId) => {
    navigate(`/tutorial/${tutorialId}`)
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="danger" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 text-danger">Loading tutorials...</p>
      </Container>
    )
  }

  return (
    <Container>
      <div className="tutorials-header mb-4">
        <h1 className="text-center mb-4">
          <span className="text-danger">⚡</span> PMC GAMING TUTORIALS <span className="text-danger">⚡</span>
        </h1>
        
        {/* Filter Section */}
        <Row className="mb-4">
          <Col md={6} className="mx-auto">
            <div className="filter-container">
              <FaFilter className="filter-icon" />
              <Form.Select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="category-filter"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? '📋 All Categories' : cat}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Col>
        </Row>

        {/* Results count */}
        <p className="text-center text-muted">
          Found {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Tutorials Grid */}
      {filteredTutorials.length === 0 ? (
        <div className="no-tutorials text-center py-5">
          <div className="no-tutorials-icon mb-3">🎮</div>
          <h3 className="text-danger mb-3">No Tutorials Found</h3>
          <p className="text-muted mb-4">
            {searchTerm 
              ? `No tutorials matching "${searchTerm}" in ${category === 'all' ? 'any category' : category}`
              : 'No tutorials available yet. Check back later!'}
          </p>
          {searchTerm && (
            <button 
              className="clear-search-btn"
              onClick={() => window.location.reload()}
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="tutorial-grid">
          {filteredTutorials.map(tutorial => (
            <div 
              key={tutorial.id} 
              className="tutorial-card"
              onClick={() => handleTutorialClick(tutorial.id)}
            >
              <div className="thumbnail-container">
                <img 
                  src={tutorial.thumbnail || 'https://via.placeholder.com/300x200?text=No+Thumbnail'} 
                  alt={tutorial.title}
                  className="thumbnail"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error'
                  }}
                />
                <div className="play-overlay">
                  <FaPlay className="play-icon" />
                </div>
                <span className="category-badge">{tutorial.category || 'Uncategorized'}</span>
              </div>
              
              <div className="tutorial-info">
                <h3 className="tutorial-title">{tutorial.title || 'Untitled'}</h3>
                <p className="tutorial-description">
                  {tutorial.description 
                    ? (tutorial.description.length > 100 
                      ? tutorial.description.substring(0, 100) + '...' 
                      : tutorial.description)
                    : 'No description available'}
                </p>
                <div className="tutorial-meta">
                  <span className="tutorial-date">
                    📅 {tutorial.date || 'No date'}
                  </span>
                  <span className="watch-now">
                    Watch Now ▶️
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}

export default Tutorials