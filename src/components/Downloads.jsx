import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { FaDownload, FaSearch, FaExternalLinkAlt, FaTag, FaCalendarAlt, FaFilter, FaTimes, FaFileAlt } from 'react-icons/fa'
import { database } from '../firebase'
import { ref, onValue } from 'firebase/database'

const CATEGORIES = ['All', 'APK', 'Guide', 'Tool', 'Config', 'Patch', 'Other']

function Downloads() {
  const [downloads, setDownloads] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    const dlRef = ref(database, 'downloads/')
    const unsub = onValue(dlRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const arr = Object.keys(data).map(k => ({ id: k, ...data[k] }))
        setDownloads(arr.sort((a, b) => new Date(b.date) - new Date(a.date)))
      } else {
        setDownloads([])
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const filtered = downloads.filter(d => {
    const matchSearch = search.trim() === '' ||
      d.title?.toLowerCase().includes(search.toLowerCase()) ||
      d.description?.toLowerCase().includes(search.toLowerCase()) ||
      d.category?.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'All' || d.category === activeCategory
    return matchSearch && matchCat
  })

  return (
    <div className="dl-page">

      {/* HERO */}
      <div className="dl-hero">
        <div className="dl-hero-bg" />
        <div className="dl-hero-content">
          <div className="dl-hero-icon"><FaDownload /></div>
          <h1 className="dl-hero-title">
            <span className="dl-hero-title-main">DOWNLOADS</span>
            <span className="dl-hero-title-sub">PMC GAMING RESOURCES</span>
          </h1>
          <p className="dl-hero-desc">APKs, guides, configs, and tools curated by the PMC Gaming team.</p>

          {/* Search */}
          <div className="dl-search-wrap">
            <FaSearch className="dl-search-icon" />
            <input
              className="dl-search-input"
              type="text"
              placeholder="Search by title, keyword, category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="dl-search-clear" onClick={() => setSearch('')}>
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>

      <Container>

        {/* CATEGORY FILTER */}
        <div className="dl-filter-bar">
          <FaFilter className="dl-filter-icon" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`dl-cat-btn ${activeCategory === cat ? 'dl-cat-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* RESULTS INFO */}
        {!loading && (
          <div className="dl-results-info">
            {filtered.length === 0
              ? 'NO RESULTS FOUND'
              : `${filtered.length} FILE${filtered.length !== 1 ? 'S' : ''} AVAILABLE`}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="dl-loading">
            <div className="dl-loading-spinner" />
            <span>LOADING FILES...</span>
          </div>
        )}

        {/* EMPTY */}
        {!loading && filtered.length === 0 && (
          <div className="dl-empty">
            <FaFileAlt className="dl-empty-icon" />
            <p className="dl-empty-title">
              {downloads.length === 0 ? 'NO FILES UPLOADED YET' : 'NO RESULTS FOUND'}
            </p>
            <p className="dl-empty-sub">
              {downloads.length === 0
                ? 'Check back soon — the admin will upload files here.'
                : 'Try a different search term or category.'}
            </p>
          </div>
        )}

        {/* GRID */}
        {!loading && filtered.length > 0 && (
          <Row className="g-4 mb-5">
            {filtered.map((item, i) => (
              <Col key={item.id} lg={4} md={6}>
                <div className="dl-card" style={{ animationDelay: `${i * 0.05}s` }}>
                  {/* Category badge */}
                  <div className="dl-card-top">
                    <span className="dl-card-cat">{item.category || 'Other'}</span>
                    <span className="dl-card-date">
                      <FaCalendarAlt style={{ marginRight: 5 }} />
                      {item.date ? new Date(item.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </span>
                  </div>

                  {/* Icon + Title */}
                  <div className="dl-card-body">
                    <div className="dl-card-icon-wrap">
                      <FaDownload className="dl-card-icon" />
                    </div>
                    <h3 className="dl-card-title">{item.title}</h3>
                    <p className="dl-card-desc">{item.description}</p>
                  </div>

                  {/* Download button */}
                  <div className="dl-card-footer">
                    <a
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dl-download-btn"
                      onClick={e => { if (!item.downloadUrl) e.preventDefault() }}
                    >
                      <FaDownload className="me-2" />
                      DOWNLOAD
                      <FaExternalLinkAlt className="dl-ext-icon" />
                    </a>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

      </Container>
    </div>
  )
}

export default Downloads