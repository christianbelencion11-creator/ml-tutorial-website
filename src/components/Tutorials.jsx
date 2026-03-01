import React, { useState, useEffect } from 'react'
import { Container, Form, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FaPlay, FaFilter, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa'
import { database } from '../firebase'
import { ref, onValue } from 'firebase/database'

const ITEMS_PER_PAGE = 12

function Tutorials({ searchTerm }) {
  const navigate = useNavigate()
  const [tutorials, setTutorials] = useState([])
  const [filteredTutorials, setFilteredTutorials] = useState([])
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState(['all'])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const tutorialsRef = ref(database, 'tutorials/')
    onValue(tutorialsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const arr = Object.keys(data).map(key => ({ id: key, ...data[key] }))
        arr.sort((a, b) => new Date(b.date) - new Date(a.date))
        setTutorials(arr)
        const cats = ['all', ...new Set(arr.map(t => t.category).filter(Boolean))]
        setCategories(cats)
      } else {
        setTutorials([])
      }
      setLoading(false)
    }, (error) => {
      console.error('Firebase error:', error)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    let filtered = tutorials
    if (searchTerm) {
      filtered = filtered.filter(t =>
        (t.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (t.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (t.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      )
    }
    if (category !== 'all') {
      filtered = filtered.filter(t => t.category === category)
    }
    setFilteredTutorials(filtered)
    setCurrentPage(1) // reset to page 1 on filter change
  }, [searchTerm, category, tutorials])

  const totalPages = Math.ceil(filteredTutorials.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const paginated = filteredTutorials.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  const goToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Generate page numbers - Google style (show max 7 pages)
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = []
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages)
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
    }
    return pages
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

        {/* Filter bar */}
        <div className="filter-bar">
          <span className="filter-label"><FaFilter size={11} /> FILTER</span>
          <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} className="category-filter">
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </Form.Select>
          <span className="results-count">
            {filteredTutorials.length} result{filteredTutorials.length !== 1 ? 's' : ''}
          </span>
          {totalPages > 1 && (
            <span className="page-indicator">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>
      </div>

      {filteredTutorials.length === 0 ? (
        <div className="no-tutorials">
          <span className="no-tutorials-icon">🎮</span>
          <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>No Tutorials Found</h4>
          <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {searchTerm
              ? `No results for "${searchTerm}" in ${category === 'all' ? 'any category' : category}`
              : 'No tutorials available yet. Check back soon!'}
          </p>
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => window.location.reload()}>Clear Search</button>
          )}
        </div>
      ) : (
        <>
          {/* Tutorial Grid */}
          <div className="tutorial-grid">
            {paginated.map(tutorial => (
              <div key={tutorial.id} className="tutorial-card" onClick={() => navigate(`/tutorial/${tutorial.id}`)}>
                <div className="thumbnail-container">
                  <img
                    src={tutorial.thumbnail || 'https://via.placeholder.com/300x190?text=No+Thumbnail'}
                    alt={tutorial.title}
                    className="thumbnail"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x190?text=No+Image' }}
                  />
                  <div className="play-overlay">
                    <div className="play-icon-wrap"><FaPlay className="play-icon" /></div>
                  </div>
                  <span className="category-badge">{tutorial.category || 'General'}</span>
                </div>
                <div className="tutorial-info">
                  <h3 className="tutorial-title">{tutorial.title || 'Untitled'}</h3>
                  <p className="tutorial-description">
                    {tutorial.description
                      ? (tutorial.description.length > 90 ? tutorial.description.substring(0, 90) + '...' : tutorial.description)
                      : 'No description available.'}
                  </p>
                  <div className="tutorial-meta">
                    <span className="tutorial-date">
                      {tutorial.date ? new Date(tutorial.date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                    </span>
                    <span className="watch-now">Watch Now <FaPlay size={9} /></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Google-style Pagination */}
          {totalPages > 1 && (
            <div className="tut-pagination">
              {/* Prev */}
              <button
                className="tut-page-btn tut-page-nav"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft size={12} /> Prev
              </button>

              {/* Page numbers */}
              {getPageNumbers().map((page, i) => (
                page === '...' ? (
                  <span key={`dots-${i}`} className="tut-page-dots">...</span>
                ) : (
                  <button
                    key={page}
                    className={`tut-page-btn ${currentPage === page ? 'tut-page-active' : ''}`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                )
              ))}

              {/* Next */}
              <button
                className="tut-page-btn tut-page-nav"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next <FaChevronRight size={12} />
              </button>
            </div>
          )}

          {/* Results info */}
          <div className="tut-results-info">
            Showing {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, filteredTutorials.length)} of {filteredTutorials.length} tutorials
          </div>
        </>
      )}
    </Container>
  )
}

export default Tutorials