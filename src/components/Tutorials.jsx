import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FaPlay, FaFilter } from 'react-icons/fa'
import { database } from '../firebase'
import { ref, onValue } from 'firebase/database'

function Tutorials({ searchTerm }) {
  const navigate = useNavigate()
  const [tutorials, setTutorials] = useState([])
  const [filteredTutorials, setFilteredTutorials] = useState([])
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState(['all'])

  useEffect(() => {
    const tutorialsRef = ref(database, 'tutorials/')
    onValue(tutorialsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const tutorialsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }))
        tutorialsArray.sort((a, b) => new Date(b.date) - new Date(a.date))
        setTutorials(tutorialsArray)
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

  useEffect(() => {
    let filtered = tutorials
    if (searchTerm) {
      filtered = filtered.filter(tutorial =>
        (tutorial.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (tutorial.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (tutorial.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      )
    }
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
        <Spinner animation="border" variant="danger" style={{ width: '2.5rem', height: '2.5rem' }} />
        <p className="mt-3" style={{ color: '#555', fontSize: '0.9rem' }}>Loading tutorials...</p>
      </Container>
    )
  }

  return (
    <Container>
      {/* Header */}
      <div className="tutorials-header mb-2">
        <h1 className="tutorials-page-title">PMC GAMING TUTORIALS</h1>
        <p className="tutorials-page-subtitle">
          {searchTerm ? `Search results for "${searchTerm}"` : 'Browse all video guides and strategies'}
        </p>
        <hr className="tutorials-divider" />

        {/* Filter Bar */}
        <div className="filter-bar">
          <span className="filter-label">
            <FaFilter size={11} /> FILTER
          </span>
          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </Form.Select>
          <span className="results-count">
            {filteredTutorials.length} result{filteredTutorials.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredTutorials.length === 0 ? (
        <div className="no-tutorials">
          <div className="no-tutorials-icon">🎮</div>
          <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>No Tutorials Found</h4>
          <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {searchTerm
              ? `No results for "${searchTerm}" in ${category === 'all' ? 'any category' : category}`
              : 'No tutorials available yet. Check back soon!'}
          </p>
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => window.location.reload()}>
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
                  src={tutorial.thumbnail || 'https://via.placeholder.com/300x185?text=No+Thumbnail'}
                  alt={tutorial.title}
                  className="thumbnail"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://via.placeholder.com/300x185?text=No+Image'
                  }}
                />
                <div className="play-overlay">
                  <div className="play-icon-wrap">
                    <FaPlay className="play-icon" />
                  </div>
                </div>
                <span className="category-badge">{tutorial.category || 'General'}</span>
              </div>

              <div className="tutorial-info">
                <h3 className="tutorial-title">{tutorial.title || 'Untitled'}</h3>
                <p className="tutorial-description">
                  {tutorial.description
                    ? (tutorial.description.length > 90
                      ? tutorial.description.substring(0, 90) + '...'
                      : tutorial.description)
                    : 'No description available.'}
                </p>
                <div className="tutorial-meta">
                  <span className="tutorial-date">
                    {tutorial.date ? new Date(tutorial.date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                  </span>
                  <span className="watch-now">
                    Watch Now <FaPlay size={9} />
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