import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'

function Admin() {
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

  useEffect(() => {
    const saved = localStorage.getItem('mlbb_tutorials')
    if (saved) {
      setTutorials(JSON.parse(saved))
    }
  }, [])

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
      // Update existing
      updatedTutorials = tutorials.map(t => 
        t.id === editingId ? { ...formData, id: editingId } : t
      )
    } else {
      // Add new
      const newTutorial = {
        ...formData,
        id: Date.now()
      }
      updatedTutorials = [...tutorials, newTutorial]
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
  }

  const handleEdit = (tutorial) => {
    setFormData(tutorial)
    setEditingId(tutorial.id)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tutorial?')) {
      const updated = tutorials.filter(t => t.id !== id)
      setTutorials(updated)
      localStorage.setItem('mlbb_tutorials', JSON.stringify(updated))
    }
  }

  return (
    <Container>
      <div className="admin-panel">
        <h2 className="text-center mb-4">Admin Panel</h2>
        
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