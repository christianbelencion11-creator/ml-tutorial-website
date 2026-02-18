import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Table, Alert, Modal, Card, Badge } from 'react-bootstrap'
import { FaEdit, FaTrash, FaLock, FaPlus, FaSignOutAlt, FaEye, FaEyeSlash, FaSave, FaTimes, FaVideo, FaTag, FaCalendarAlt, FaLink, FaImage } from 'react-icons/fa'
import { database } from '../firebase'
import { ref, push, set, remove, onValue } from 'firebase/database'

function Admin() {
  // ============================================
  // ADMIN CONFIGURATION - EASY TO CUSTOMIZE
  // ============================================
  
  // 🔐 ADMIN PASSWORD - CHANGE THIS TO YOUR OWN PASSWORD
  // Example: "admin123", "christian2024", "PMCgaming!23"
  const ADMIN_PASSWORD = 'mlbb123'
  
  // 🎨 ADMIN PANEL SETTINGS
  const APP_NAME = 'PMC GAMING TUTORIALS'  // Change this to your app name
  const ITEMS_PER_PAGE = 10                // Number of tutorials per page
  
  // ============================================
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [tutorials, setTutorials] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [showSuccess, setShowSuccess] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [tutorialToDelete, setTutorialToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [formErrors, setFormErrors] = useState({})
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    youtubeUrl: '',
    category: 'Hero Guide',
    date: new Date().toISOString().split('T')[0],
    views: 0,
    duration: '',
    difficulty: 'Intermediate'
  })

  // Load tutorials from Firebase
  useEffect(() => {
    const tutorialsRef = ref(database, 'tutorials/')
    onValue(tutorialsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const tutorialsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }))
        setTutorials(tutorialsArray.sort((a, b) => new Date(b.date) - new Date(a.date)))
      } else {
        setTutorials([])
      }
    })
  }, [])

  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = 'Title is required'
    if (!formData.description.trim()) errors.description = 'Description is required'
    if (!formData.thumbnail.trim()) errors.thumbnail = 'Thumbnail URL is required'
    if (!formData.youtubeUrl.trim()) errors.youtubeUrl = 'YouTube URL is required'
    if (!formData.youtubeUrl.includes('youtube.com/embed/') && !formData.youtubeUrl.includes('youtu.be')) {
      errors.youtubeUrl = 'Please use a valid YouTube embed URL'
    }
    return errors
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('❌ Incorrect password! Please try again.')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setShowSuccess('❌ Please fix the errors in the form')
      setTimeout(() => setShowSuccess(''), 3000)
      return
    }
    
    try {
      if (editingId) {
        // Update existing tutorial
        await set(ref(database, `tutorials/${editingId}`), {
          ...formData,
          lastUpdated: new Date().toISOString()
        })
        setShowSuccess('✅ Tutorial updated successfully!')
      } else {
        // Add new tutorial
        const tutorialsRef = ref(database, 'tutorials/')
        await push(tutorialsRef, {
          ...formData,
          createdAt: new Date().toISOString(),
          views: 0
        })
        setShowSuccess('✅ New tutorial added successfully!')
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        thumbnail: '',
        youtubeUrl: '',
        category: 'Hero Guide',
        date: new Date().toISOString().split('T')[0],
        views: 0,
        duration: '',
        difficulty: 'Intermediate'
      })
      setEditingId(null)
      setFormErrors({})

      setTimeout(() => setShowSuccess(''), 3000)
    } catch (error) {
      setShowSuccess('❌ Error saving tutorial! Please try again.')
    }
  }

  const handleEdit = (tutorial) => {
    setFormData(tutorial)
    setEditingId(tutorial.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteClick = (tutorial) => {
    setTutorialToDelete(tutorial)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (tutorialToDelete) {
      try {
        await remove(ref(database, `tutorials/${tutorialToDelete.id}`))
        setShowSuccess('✅ Tutorial deleted successfully!')
        setTimeout(() => setShowSuccess(''), 3000)
        setShowDeleteModal(false)
        setTutorialToDelete(null)
      } catch (error) {
        setShowSuccess('❌ Error deleting tutorial!')
      }
    }
  }

  // Filter and pagination
  const filteredTutorials = tutorials.filter(tutorial => 
    tutorial.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutorial.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutorial.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pageCount = Math.ceil(filteredTutorials.length / ITEMS_PER_PAGE)
  const currentTutorials = filteredTutorials.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Category options
  const categories = ['Hero Guide', 'Builds', 'Tips', 'Gameplay', 'Strategy', 'Tutorial', 'Review']
  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

  // Login form
  if (!isAuthenticated) {
    return (
      <Container fluid className="admin-login-container">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={5} lg={4}>
            <Card className="admin-login-card border-0 shadow-lg">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="login-icon-wrapper mb-3">
                    <FaLock size={40} className="text-danger" />
                  </div>
                  <h2 className="fw-bold mb-1">{APP_NAME}</h2>
                  <p className="text-muted">Admin Panel Login</p>
                </div>

                {error && (
                  <Alert variant="danger" className="text-center">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Password</Form.Label>
                    <div className="password-input-wrapper">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        className="password-input"
                        required
                        autoFocus
                      />
                      <Button
                        variant="link"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </div>
                    <Form.Text className="text-muted">
                      Default password: <code>mlbb123</code> (change in Admin.jsx)
                    </Form.Text>
                  </Form.Group>

                  <Button type="submit" variant="danger" className="w-100 py-2 fw-bold" size="lg">
                    <FaLock className="me-2" /> Login to Admin Panel
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }

  // Admin Panel
  return (
    <Container fluid className="admin-panel-container py-4">
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete <strong>"{tutorialToDelete?.title}"</strong>?</p>
          <p className="text-danger mb-0">This action cannot be undone!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            <FaTrash className="me-2" /> Delete Tutorial
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Header */}
      <div className="admin-header mb-4">
        <Row className="align-items-center">
          <Col>
            <h2 className="mb-0">
              <span className="text-danger">⚡</span> {APP_NAME} Admin
            </h2>
            <p className="text-muted mb-0">Manage your tutorials and content</p>
          </Col>
          <Col className="text-end">
            <Button variant="outline-danger" onClick={handleLogout} className="px-4">
              <FaSignOutAlt className="me-2" /> Logout
            </Button>
          </Col>
        </Row>
      </div>

      {showSuccess && (
        <Alert 
          variant={showSuccess.includes('✅') ? 'success' : 'danger'} 
          className="text-center mb-4"
          dismissible
          onClose={() => setShowSuccess('')}
        >
          {showSuccess}
        </Alert>
      )}

      <Row>
        {/* Form Column */}
        <Col lg={5} className="mb-4">
          <Card className="admin-form-card border-0 shadow-sm">
            <Card.Header className="bg-danger text-white py-3">
              <h4 className="mb-0">
                {editingId ? <><FaEdit className="me-2" /> Edit Tutorial</> : <><FaPlus className="me-2" /> Add New Tutorial</>}
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <FaVideo className="me-2 text-danger" /> Title
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Ling Advanced Guide"
                        isInvalid={!!formErrors.title}
                        className="py-2"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.title}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <FaTag className="me-2 text-danger" /> Category
                      </Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="py-2"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Difficulty</Form.Label>
                      <Form.Select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        className="py-2"
                      >
                        {difficultyLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what this tutorial covers..."
                    rows={3}
                    isInvalid={!!formErrors.description}
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <FaImage className="me-2 text-danger" /> Thumbnail URL
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        isInvalid={!!formErrors.thumbnail}
                        className="py-2"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.thumbnail}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <FaLink className="me-2 text-danger" /> YouTube URL
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="youtubeUrl"
                        value={formData.youtubeUrl}
                        onChange={handleChange}
                        placeholder="https://youtube.com/embed/..."
                        isInvalid={!!formErrors.youtubeUrl}
                        className="py-2"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.youtubeUrl}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <FaCalendarAlt className="me-2 text-danger" /> Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="py-2"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Duration (minutes)</Form.Label>
                      <Form.Control
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="e.g., 15 mins"
                        className="py-2"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2 mt-4">
                  <Button type="submit" variant="danger" className="flex-grow-1 py-2 fw-bold">
                    {editingId ? <><FaSave className="me-2" /> Update Tutorial</> : <><FaPlus className="me-2" /> Add Tutorial</>}
                  </Button>
                  {editingId && (
                    <Button 
                      variant="secondary" 
                      className="py-2 px-4"
                      onClick={() => {
                        setEditingId(null)
                        setFormData({
                          title: '',
                          description: '',
                          thumbnail: '',
                          youtubeUrl: '',
                          category: 'Hero Guide',
                          date: new Date().toISOString().split('T')[0],
                          views: 0,
                          duration: '',
                          difficulty: 'Intermediate'
                        })
                        setFormErrors({})
                      }}
                    >
                      <FaTimes /> Cancel
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Table Column */}
        <Col lg={7}>
          <Card className="admin-table-card border-0 shadow-sm">
            <Card.Header className="bg-dark text-white py-3">
              <Row className="align-items-center">
                <Col>
                  <h4 className="mb-0">📚 Tutorials Manager</h4>
                </Col>
                <Col md={5}>
                  <Form.Control
                    type="text"
                    placeholder="🔍 Search tutorials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-dark text-white border-secondary"
                  />
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="p-0">
              {filteredTutorials.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-0">No tutorials found. Add your first tutorial!</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover className="admin-table mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Date</th>
                          <th>Difficulty</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTutorials.map(tutorial => (
                          <tr key={tutorial.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={tutorial.thumbnail} 
                                  alt={tutorial.title}
                                  style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px' }}
                                  onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                                />
                                <div>
                                  <strong>{tutorial.title}</strong>
                                  <br />
                                  <small className="text-muted">{tutorial.views || 0} views</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <Badge bg="danger" className="px-3 py-2">
                                {tutorial.category}
                              </Badge>
                            </td>
                            <td>{new Date(tutorial.date).toLocaleDateString()}</td>
                            <td>
                              <Badge bg={tutorial.difficulty === 'Expert' ? 'dark' : 'secondary'}>
                                {tutorial.difficulty || 'Intermediate'}
                              </Badge>
                            </td>
                            <td className="text-center">
                              <Button 
                                variant="warning" 
                                size="sm" 
                                className="me-2 px-3"
                                onClick={() => handleEdit(tutorial)}
                              >
                                <FaEdit className="me-1" /> Edit
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                className="px-3"
                                onClick={() => handleDeleteClick(tutorial)}
                              >
                                <FaTrash className="me-1" /> Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {pageCount > 1 && (
                    <div className="d-flex justify-content-center align-items-center p-3 border-top">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="me-2"
                      >
                        Previous
                      </Button>
                      <span className="mx-3">
                        Page {currentPage} of {pageCount}
                      </span>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(pageCount, prev + 1))}
                        disabled={currentPage === pageCount}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Admin