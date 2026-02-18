import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FaPlay } from 'react-icons/fa'

function Tutorials({ searchTerm }) {
  const navigate = useNavigate()
  const [tutorials, setTutorials] = useState([])
  const [category, setCategory] = useState('all')

  // Load tutorials from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mlbb_tutorials')
    if (saved) {
      setTutorials(JSON.parse(saved))
    } else {
      // Sample data
      const sample = [
        {
          id: 1,
          title: 'Ling Advanced Guide',
          description: 'Master Ling with these pro combos and strategies',
          thumbnail: 'https://via.placeholder.com/300x200/ff4500/ffffff?text=Ling+Guide',
          youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          category: 'Hero Guide',
          date: '2024-01-15'
        },
        {
          id: 2,
          title: 'Best Builds for Assassins',
          description: 'Optimal item builds for every assassin hero',
          thumbnail: 'https://via.placeholder.com/300x200/ff8c00/ffffff?text=Assassin+Builds',
          youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          category: 'Builds',
          date: '2024-01-10'
        },
        {
          id: 3,
          title: 'Team Fight Strategies',
          description: 'How to win team fights every time',
          thumbnail: 'https://via.placeholder.com/300x200/ff4500/ffffff?text=Team+Fight',
          youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          category: 'Gameplay',
          date: '2024-01-05'
        }
      ]
      setTutorials(sample)
      localStorage.setItem('mlbb_tutorials', JSON.stringify(sample))
    }
  }, [])

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category === 'all' || tutorial.category === category
    return matchesSearch && matchesCategory
  })

  const categories = ['all', 'Hero Guide', 'Builds', 'Tips', 'Gameplay', 'Strategy']

  return (
    <Container>
      <div className="glow-card">
        <h2 className="text-center mb-4">MLBB Tutorials</h2>
        
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
        <div className="tutorial-grid">
          {filteredTutorials.length > 0 ? (
            filteredTutorials.map(tutorial => (
              <div 
                key={tutorial.id} 
                className="tutorial-card"
                onClick={() => navigate(`/tutorial/${tutorial.id}`)}
              >
                <div className="thumbnail-container">
                  <img src={tutorial.thumbnail} alt={tutorial.title} className="thumbnail" />
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
            ))
          ) : (
            <p className="text-center">No tutorials found</p>
          )}
        </div>
      </div>
    </Container>
  )
}

export default Tutorials