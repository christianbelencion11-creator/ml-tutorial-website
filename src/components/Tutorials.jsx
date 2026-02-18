import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FaPlay } from 'react-icons/fa'
import { database } from '../firebase'
import { ref, onValue } from 'firebase/database'

function Tutorials({ searchTerm }) {
  const navigate = useNavigate()
  const [tutorials, setTutorials] = useState([])
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  // Load tutorials from Firebase
  useEffect(() => {
    const tutorialsRef = ref(database, 'tutorials/')
    onValue(tutorialsRef, (snapshot) => {
      const data = snapshot.val()
      console.log("Firebase data:", data) // CHECK THIS IN CONSOLE
      
      if (data) {
        const tutorialsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }))
        console.log("Tutorials array:", tutorialsArray) // CHECK THIS
        setTutorials(tutorialsArray)
      } else {
        setTutorials([])
      }
      setLoading(false)
    }, (error) => {
      console.error("Firebase error:", error)
      setLoading(false)
    })
  }, [])

  // Filter tutorials
  const filteredTutorials = tutorials.filter(tutorial => {
    if (!tutorial) return false
    const matchesSearch = (tutorial.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (tutorial.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesCategory = category === 'all' || tutorial.category === category
    return matchesSearch && matchesCategory
  })

  const categories = ['all', 'Hero Guide', 'Builds', 'Tips', 'Gameplay', 'Strategy']

  if (loading) {
    return <div className="text-center py-5">Loading tutorials...</div>
  }

  return (
    <Container>
      <div className="glow-card">
        <h2 className="text-center mb-4">PMC GAMING TUTORIALS</h2>
        
        {/* Filter Section */}
        <Row className="mb-4">
          <Col md={6} className="mx-auto">
            <Form.Select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* Tutorials Grid */}
        {filteredTutorials.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No tutorials found. Add your first tutorial in Admin panel!</p>
          </div>
        ) : (
          <div className="tutorial-grid">
            {filteredTutorials.map(tutorial => (
              <div 
                key={tutorial.id} 
                className="tutorial-card"
                onClick={() => navigate(`/tutorial/${tutorial.id}`)}
              >
                <div className="thumbnail-container">
                  <img 
                    src={tutorial.thumbnail} 
                    alt={tutorial.title}
                    className="thumbnail"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}
                  />
                  <div className="play-overlay">
                    <FaPlay className="play-icon" />
                  </div>
                  <span className="category-badge">{tutorial.category}</span>
                </div>
                <div className="tutorial-info">
                  <h3 className="tutorial-title">{tutorial.title}</h3>
                  <p className="tutorial-description">{tutorial.description}</p>
                  <div className="tutorial-meta">
                    <span>📅 {tutorial.date}</span>
                    <span>▶️ Watch Now</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}

export default Tutorials