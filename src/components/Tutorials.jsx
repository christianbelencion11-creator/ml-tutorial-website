import React, { useState, useEffect, useRef } from 'react'
import { Container, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FaPlay, FaChevronLeft, FaChevronRight, FaSearch, FaTimes, FaFire, FaGamepad } from 'react-icons/fa'
import { database } from '../firebase'
import { ref, onValue } from 'firebase/database'

const ITEMS_PER_PAGE = 12

const CATEGORY_COLORS = {
  'Hero Guide':  { bg: '#ff0000', text: '#000' },
  'Builds':      { bg: '#ff6600', text: '#000' },
  'Tips':        { bg: '#ffaa00', text: '#000' },
  'Gameplay':    { bg: '#00aaff', text: '#000' },
  'Strategy':    { bg: '#aa00ff', text: '#fff' },
  'Auto Upload': { bg: '#222', text: '#ff0000' },
  'default':     { bg: '#ff0000', text: '#000' },
}

function getCatStyle(cat) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS['default']
}

function Tutorials({ searchTerm: externalSearch }) {
  const navigate = useNavigate()
  const [tutorials, setTutorials] = useState([])
  const [filteredTutorials, setFilteredTutorials] = useState([])
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState(['all'])
  const [currentPage, setCurrentPage] = useState(1)
  const [localSearch, setLocalSearch] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const searchRef = useRef(null)

  // Combined search: navbar + local
  const combinedSearch = localSearch || externalSearch || ''

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
    if (combinedSearch) {
      filtered = filtered.filter(t =>
        (t.title?.toLowerCase() || '').includes(combinedSearch.toLowerCase()) ||
        (t.description?.toLowerCase() || '').includes(combinedSearch.toLowerCase()) ||
        (t.category?.toLowerCase() || '').includes(combinedSearch.toLowerCase())
      )
    }
    if (category !== 'all') {
      filtered = filtered.filter(t => t.category === category)
    }
    setFilteredTutorials(filtered)
    setCurrentPage(1)
  }, [combinedSearch, category, tutorials])

  const totalPages = Math.ceil(filteredTutorials.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const paginated = filteredTutorials.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  const goToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
      <div className="tut-loading-screen">
        <div className="tut-loading-inner">
          <div className="tut-loading-ring" />
          <FaGamepad className="tut-loading-icon" />
          <p className="tut-loading-text">LOADING TUTORIALS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="tut-page">

      {/* ── PAGE HERO ── */}
      <div className="tut-hero">
        <div className="tut-hero-bg" />
        <div className="tut-hero-content">
          <div className="tut-hero-eyebrow">
            <FaFire className="tut-eyebrow-icon" />
            <span>PMC GAMING</span>
          </div>
          <h1 className="tut-hero-title">
            <span className="tut-title-top">VIDEO</span>
            <span className="tut-title-main">TUTORIALS</span>
          </h1>
          <p className="tut-hero-sub">
            {combinedSearch
              ? `Search results for "${combinedSearch}"`
              : 'Master every hero. Dominate every match.'}
          </p>

          {/* ── SEARCH BAR ── */}
          <div className={`tut-searchbar ${inputFocused ? 'tut-searchbar-focus' : ''}`}>
            <FaSearch className="tut-search-icon" />
            <input
              ref={searchRef}
              type="text"
              className="tut-search-input"
              placeholder="Search tutorials, heroes, strategies..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
            {localSearch && (
              <button className="tut-search-clear" onClick={() => setLocalSearch('')}>
                <FaTimes size={12} />
              </button>
            )}
          </div>

          {/* ── STATS ROW ── */}
          <div className="tut-hero-stats">
            <div className="tut-hero-stat">
              <span className="tut-stat-num">{tutorials.length}</span>
              <span className="tut-stat-label">TUTORIALS</span>
            </div>
            <div className="tut-hero-stat-divider" />
            <div className="tut-hero-stat">
              <span className="tut-stat-num">{categories.length - 1}</span>
              <span className="tut-stat-label">CATEGORIES</span>
            </div>
            <div className="tut-hero-stat-divider" />
            <div className="tut-hero-stat">
              <span className="tut-stat-num">FREE</span>
              <span className="tut-stat-label">ALWAYS</span>
            </div>
          </div>
        </div>
      </div>

      <Container>
        {/* ── CATEGORY FILTER ── */}
        <div className="tut-filter-row">
          <div className="tut-filter-scroll">
            {categories.map(cat => (
              <button
                key={cat}
                className={`tut-cat-pill ${category === cat ? 'tut-cat-active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat === 'all' ? '🎮 All' : cat}
              </button>
            ))}
          </div>
          <span className="tut-filter-count">
            {filteredTutorials.length} result{filteredTutorials.length !== 1 ? 's' : ''}
            {totalPages > 1 && <span className="tut-filter-page"> · Page {currentPage}/{totalPages}</span>}
          </span>
        </div>

        {/* ── EMPTY STATE ── */}
        {filteredTutorials.length === 0 ? (
          <div className="tut-empty">
            <div className="tut-empty-icon">🎮</div>
            <h3 className="tut-empty-title">No Tutorials Found</h3>
            <p className="tut-empty-sub">
              {combinedSearch
                ? `No results for "${combinedSearch}" in ${category === 'all' ? 'any category' : category}`
                : 'No tutorials available yet. Check back soon!'}
            </p>
            {(combinedSearch || category !== 'all') && (
              <button className="tut-empty-reset" onClick={() => { setLocalSearch(''); setCategory('all') }}>
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ── GRID ── */}
            <div className="tut-grid">
              {paginated.map((tutorial, idx) => {
                const catStyle = getCatStyle(tutorial.category)
                return (
                  <div
                    key={tutorial.id}
                    className="tut-card"
                    style={{ animationDelay: `${idx * 0.04}s` }}
                    onClick={() => navigate(`/tutorial/${tutorial.id}`)}
                  >
                    {/* Thumbnail */}
                    <div className="tut-card-thumb">
                      <img
                        src={tutorial.thumbnail || 'https://via.placeholder.com/320x180?text=No+Thumbnail'}
                        alt={tutorial.title}
                        className="tut-card-img"
                        onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/320x180?text=No+Image' }}
                      />
                      {/* Overlay on hover */}
                      <div className="tut-card-overlay">
                        <div className="tut-play-btn">
                          <FaPlay size={20} />
                        </div>
                        <span className="tut-card-watch">WATCH NOW</span>
                      </div>
                      {/* Category badge */}
                      <span
                        className="tut-card-badge"
                        style={{ background: catStyle.bg, color: catStyle.text }}
                      >
                        {tutorial.category || 'General'}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="tut-card-info">
                      <h3 className="tut-card-title">{tutorial.title || 'Untitled'}</h3>
                      <p className="tut-card-desc">
                        {tutorial.description
                          ? (tutorial.description.length > 85 ? tutorial.description.substring(0, 85) + '...' : tutorial.description)
                          : 'No description available.'}
                      </p>
                      <div className="tut-card-meta">
                        <span className="tut-card-date">
                          {tutorial.date
                            ? new Date(tutorial.date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
                            : '—'}
                        </span>
                        <span className="tut-card-cta">
                          <FaPlay size={8} /> Watch
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── PAGINATION ── */}
            {totalPages > 1 && (
              <div className="tut-pagination">
                <button
                  className="tut-page-btn tut-page-nav"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft size={11} /> Prev
                </button>
                {getPageNumbers().map((page, i) =>
                  page === '...' ? (
                    <span key={`dots-${i}`} className="tut-page-dots">···</span>
                  ) : (
                    <button
                      key={page}
                      className={`tut-page-btn ${currentPage === page ? 'tut-page-active' : ''}`}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  className="tut-page-btn tut-page-nav"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next <FaChevronRight size={11} />
                </button>
              </div>
            )}

            <div className="tut-results-info">
              Showing {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, filteredTutorials.length)} of {filteredTutorials.length} tutorials
            </div>
          </>
        )}
      </Container>
    </div>
  )
}

export default Tutorials