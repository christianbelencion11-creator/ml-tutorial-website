import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap'
import { FaEdit, FaTrash, FaLock } from 'react-icons/fa'
import { database } from '../firebase'
import { ref, push, set, remove, onValue } from 'firebase/database'

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [tutorials, setTutorials] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [showSuccess, setShowSuccess] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    youtubeUrl: '',
    category: 'Hero Guide',
    date: new Date().toISOString().split('T')[0]
  })

  const ADMIN_PASSWORD = 'mlbb123'

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
        setTutorials(tutorialsArray)
      } else {
        setTutorials([])
      }
    })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingId) {
        // Update existing tutorial
        await set(ref(database, `tutorials/${editingId}`), formData)
        setShowSuccess('✅ Tutorial updated successfully!')
      } else {
        // Add new tutorial
        const tutorialsRef = ref(database, 'tutorials/')
        await push(tutorialsRef, formData)
        setShowSuccess('✅ New tutorial added successfully!')
      }
      
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

      setTimeout(() => setShowSuccess(''), 3000)
    } catch (error) {
      setShowSuccess('❌ Error saving tutorial!')
    }
  }

  const handleEdit = (tutorial) => {
    setFormData(tutorial)
    setEditingId(tutorial.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tutorial?')) {
      try {
        await remove(ref(database, `tutorials/${id}`))
        setShowSuccess('✅ Tutorial deleted successfully!')
        setTimeout(() => setShowSuccess(''), 3000)
      } catch (error) {
        setShowSuccess('❌ Error deleting tutorial!')
      }
    }
  }

  // Login form
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

  // Admin Panel
  return (
    <Container>
      <div className="admin-panel">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Admin Panel - Firebase</h2>
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        
        {showSuccess && (
          <Alert variant={showSuccess.includes('✅') ? 'success' : 'danger'} className="text-center">
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
        <h3 className="mb-4">📚 Manage Tutorials (Firebase)</h3>
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