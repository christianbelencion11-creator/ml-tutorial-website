import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap'
import { FaEdit, FaTrash, FaLock } from 'react-icons/fa'

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [tutorials, setTutorials] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    youtubeUrl: '',
    category: 'Hero Guide',
    date: new Date().toISOString().split('T')[0]
  })

  // Admin password
  const ADMIN_PASSWORD = 'mlbb123'

  // Load tutorials from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mlbb_tutorials')
    if (saved) {
      setTutorials(JSON.parse(saved))
    } else {
      // Sample data kung walang laman
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
        }
      ]
      setTutorials(sample)
      localStorage.setItem('mlbb_tutorials', JSON.stringify(sample))
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('❌ Wrong password!')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword('')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    let updatedTutorials
    if (editingId) {
      // Update existing tutorial
      updatedTutorials = tutorials.map(t => 
        t.id === editingId ? { ...formData, id: editingId } : t
      )
      setShowSuccess('✅ Tutorial updated successfully!')
    } else {
      // Add new tutorial
      const newTutorial = {
        ...formData,
        id: Date.now()
      }
      updatedTutorials = [...tutorials, newTutorial]
      setShowSuccess('✅ New tutorial added successfully!')
    }
    
    setTutorials(updatedTutorials)
    localStorage.setItem('mlbb_tutorials', JSON.stringify(updatedTutorials))
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      thumbnail: '',
      youtubeUrl: '',
      category: 'Hero Guide',
      date: new Date().toISOString().split('T')[0]
    })
    setEditingId(null)

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleEdit = (tutorial) => {
    setFormData(tutorial)
    setEditingId(tutorial.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tutorial?')) {
      const updated = tutorials.filter(t => t.id !== id)
      setTutorials(updated)
      localStorage.setItem('mlbb_tutorials', JSON.stringify(updated))
      setShowSuccess('✅ Tutorial deleted successfully!')
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  // Kung hindi pa naka-login, ipakita ang login form
  if (!isAuthenticated) {
    return (
      <Container>
        <div className="admin-panel" style={{ maxWidth: '400px', margin: '50px auto' }}>
          <div className="text-center mb-4">
            <FaLock size={50} className="text-danger mb-3" />
            <h2>Admin Login</h2>
            <p className="text-muted">Enter password to access admin panel</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="form-group">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
              Login
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small className="text-muted">Default password: mlbb123</small>
          </div>
        </div>
      </Container>
    )
  }

  // Pag naka-login na, ipakita ang admin panel
  return (
    <Container>
      <div className="admin-panel">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Admin Panel</h2>
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        
        {showSuccess && (
          <Alert variant="success" className="text-center">
            {showSuccess}
          </Alert>
        )}

        {/* Add/Edit Form */}
        <div className="glow-card mb-5">
          <h3 className="mb-4">{editingId ? '✏️ Edit Tutorial' : '➕ Add New Tutorial'}</h3>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Ling Advanced Guide"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Hero Guide">Hero Guide</option>
                    <option value="Builds">Builds</option>
                    <option value="Tips">Tips</option>
                    <option value="Gameplay">Gameplay</option>
                    <option value="Strategy">Strategy</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="form-group">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this tutorial covers..."
                rows={3}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label>Thumbnail URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                  <Form.Text className="text-muted">
                    Use images from Google or placeholder images
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label>YouTube Embed URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/embed/VIDEO_ID"
                    required
                  />
                  <Form.Text className="text-muted">
                    Use the embed URL format
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="form-group">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" size="lg">
                {editingId ? 'Update Tutorial' : 'Add Tutorial'}
              </Button>
              {editingId && (
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => {
                    setEditingId(null)
                    setFormData({
                      title: '',
                      description: '',
                      thumbnail: '',
                      youtubeUrl: '',
                      category: 'Hero Guide',
                      date: new Date().toISOString().split('T')[0]
                    })
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </Form>
        </div>

        {/* Tutorials List */}
        <h3 className="mb-4">📚 Manage Tutorials</h3>
        {tutorials.length === 0 ? (
          <Alert variant="info">No tutorials yet. Add your first tutorial!</Alert>
        ) : (
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tutorials.map(tutorial => (
                <tr key={tutorial.id}>
                  <td>{tutorial.title}</td>
                  <td>
                    <span className="category-badge" style={{ position: 'static' }}>
                      {tutorial.category}
                    </span>
                  </td>
                  <td>{tutorial.date}</td>
                  <td>
                    <Button 
                      variant="warning" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleEdit(tutorial)}
                    >
                      <FaEdit /> Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDelete(tutorial.id)}
                    >
                      <FaTrash /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </Container>
  )
}

export default Admin