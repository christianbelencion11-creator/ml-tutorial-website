import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap'
import { FaEdit, FaTrash, FaLock } from 'react-icons/fa'

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [tutorials, setTutorials] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    youtubeUrl: '',
    category: 'Hero Guide',
    date: new Date().toISOString().split('T')[0]
  })

  // Admin password (palitan mo ito ng gusto mong password)
  const ADMIN_PASSWORD = 'mlbb123'

  useEffect(() => {
    const saved = localStorage.getItem('mlbb_tutorials')
    if (saved) {
      setTutorials(JSON.parse(saved))
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
        
        {/* Add/Edit Form */}
        <div className="glow-card mb-5">
          <h3>{editingId ? 'Edit Tutorial' : 'Add New Tutorial'}</h3>
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
                    <option>Hero Guide</option>
                    <option>Builds</option>
                    <option>Tips</option>
                    <option>Gameplay</option>
                    <option>Strategy</option>
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
                  <Form.Label>YouTube URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    placeholder="https://youtube.com/embed/..."
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

            <Button type="submit" variant="primary">
              {editingId ? 'Update Tutorial' : 'Add Tutorial'}
            </Button>
            {editingId && (
              <Button 
                variant="secondary" 
                className="ms-2"
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
                Cancel
              </Button>
            )}
          </Form>
        </div>

        {/* Tutorials List */}
        <h3>Manage Tutorials</h3>
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
                <td>{tutorial.category}</td>
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
      </div>
    </Container>
  )
}

export default Admin