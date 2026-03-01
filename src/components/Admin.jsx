import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Table, Alert, Modal, Card } from 'react-bootstrap'
import { FaEdit, FaTrash, FaLock, FaPlus, FaSignOutAlt, FaEye, FaEyeSlash, FaSave, FaTimes, FaVideo, FaTag, FaCalendarAlt, FaLink, FaImage, FaYoutube } from 'react-icons/fa'
import { database } from '../firebase'
import { ref, push, set, remove, onValue } from 'firebase/database'
import YouTubeAuto from './YouTubeAuto'
import AdminChat from './AdminChat'

function Admin() {
  const ADMIN_PASSWORD = '09195911297'

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
  const [activeTab, setActiveTab] = useState('tutorials')

  const [formData, setFormData] = useState({
    title: '', description: '', thumbnail: '',
    youtubeUrl: '', category: 'Hero Guide',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const tutorialsRef = ref(database, 'tutorials/')
    onValue(tutorialsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const arr = Object.keys(data).map(key => ({ id: key, ...data[key] }))
        setTutorials(arr.sort((a, b) => new Date(b.date) - new Date(a.date)))
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
      setPassword('')
    } else {
      setError('❌ Incorrect password!')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.thumbnail || !formData.youtubeUrl) {
      setShowSuccess('❌ Please fill in all fields!')
      setTimeout(() => setShowSuccess(''), 3000)
      return
    }
    try {
      if (editingId) {
        await set(ref(database, `tutorials/${editingId}`), formData)
        setShowSuccess('✅ Tutorial updated!')
      } else {
        await push(ref(database, 'tutorials/'), formData)
        setShowSuccess('✅ Tutorial added!')
      }
      setFormData({ title: '', description: '', thumbnail: '', youtubeUrl: '', category: 'Hero Guide', date: new Date().toISOString().split('T')[0] })
      setEditingId(null)
      setTimeout(() => setShowSuccess(''), 3000)
    } catch {
      setShowSuccess('❌ Error saving tutorial!')
    }
  }

  const handleEdit = (tutorial) => {
    setFormData(tutorial)
    setEditingId(tutorial.id)
    setActiveTab('tutorials')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteConfirm = async () => {
    if (tutorialToDelete) {
      try {
        await remove(ref(database, `tutorials/${tutorialToDelete.id}`))
        setShowSuccess('✅ Tutorial deleted!')
        setTimeout(() => setShowSuccess(''), 3000)
        setShowDeleteModal(false)
        setTutorialToDelete(null)
      } catch {
        setShowSuccess('❌ Error deleting!')
      }
    }
  }

  const filteredTutorials = tutorials.filter(t =>
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                  <h2 className="fw-bold mb-1">PMC GAMING</h2>
                  <p className="text-muted">Admin Login</p>
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
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
                        required autoFocus
                      />
                      <Button variant="link" className="password-toggle" onClick={() => setShowPassword(!showPassword)} type="button">
                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                      </Button>
                    </div>
                  </Form.Group>
                  <Button type="submit" variant="danger" className="w-100 py-2 fw-bold" size="lg">
                    <FaLock className="me-2" /> Login
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container fluid className="admin-panel-container py-4">
      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Delete <strong>"{tutorialToDelete?.title}"</strong>?</p>
          <p className="text-danger mb-0">This cannot be undone!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteConfirm}><FaTrash className="me-2" /> Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Header */}
      <div className="admin-header mb-4">
        <Row className="align-items-center">
          <Col><h2 className="mb-0"><span className="text-danger">⚡</span> PMC GAMING Admin</h2></Col>
          <Col className="text-end">
            <Button variant="outline-danger" onClick={() => setIsAuthenticated(false)} className="px-4">
              <FaSignOutAlt className="me-2" /> Logout
            </Button>
          </Col>
        </Row>
      </div>

      {showSuccess && (
        <Alert variant={showSuccess.includes('✅') ? 'success' : 'danger'} className="text-center mb-4" dismissible onClose={() => setShowSuccess('')}>
          {showSuccess}
        </Alert>
      )}

      {/* ===== TABS ===== */}
      <div className="admin-tabs mb-4">
        <Button variant={activeTab === 'tutorials' ? 'danger' : 'outline-danger'} onClick={() => setActiveTab('tutorials')}>
          📚 Tutorials
        </Button>
        <Button variant={activeTab === 'chat' ? 'danger' : 'outline-danger'} onClick={() => setActiveTab('chat')}>
          💬 Chat Support
        </Button>
        <Button variant={activeTab === 'youtube' ? 'danger' : 'outline-danger'} onClick={() => setActiveTab('youtube')}>
          🎬 YouTube Sync
        </Button>
      </div>

      {/* YouTube Tab */}
      {activeTab === 'youtube' && <YouTubeAuto />}

      {/* Chat Tab */}
      {activeTab === 'chat' && <AdminChat />}

      {/* Tutorials Tab */}
      {activeTab === 'tutorials' && (
        <Row>
          {/* Form */}
          <Col lg={5} className="mb-4">
            <Card className="admin-form-card border-0 shadow-sm">
              <Card.Header className="bg-danger text-white py-3">
                <h4 className="mb-0">{editingId ? <><FaEdit className="me-2" /> Edit Tutorial</> : <><FaPlus className="me-2" /> Add Tutorial</>}</h4>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold"><FaVideo className="me-2 text-danger" /> Title</Form.Label>
                    <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Ling Advanced Guide" required className="py-2" />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold"><FaTag className="me-2 text-danger" /> Category</Form.Label>
                        <Form.Select name="category" value={formData.category} onChange={handleChange} className="py-2">
                          <option value="Hero Guide">Hero Guide</option>
                          <option value="Builds">Builds</option>
                          <option value="Tips">Tips</option>
                          <option value="Gameplay">Gameplay</option>
                          <option value="Strategy">Strategy</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold"><FaCalendarAlt className="me-2 text-danger" /> Date</Form.Label>
                        <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} className="py-2" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Description</Form.Label>
                    <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} rows={3} required className="py-2" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold"><FaImage className="me-2 text-danger" /> Thumbnail URL</Form.Label>
                    <Form.Control type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange} placeholder="https://..." required className="py-2" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold"><FaLink className="me-2 text-danger" /> YouTube Embed URL</Form.Label>
                    <Form.Control type="text" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleChange} placeholder="https://www.youtube.com/embed/VIDEO_ID" required className="py-2" />
                  </Form.Group>
                  <div className="d-flex gap-2 mt-4">
                    <Button type="submit" variant="danger" className="flex-grow-1 py-2 fw-bold">
                      {editingId ? <><FaSave className="me-2" /> Update</> : <><FaPlus className="me-2" /> Add Tutorial</>}
                    </Button>
                    {editingId && (
                      <Button variant="secondary" className="py-2 px-4" onClick={() => { setEditingId(null); setFormData({ title: '', description: '', thumbnail: '', youtubeUrl: '', category: 'Hero Guide', date: new Date().toISOString().split('T')[0] }) }}>
                        <FaTimes /> Cancel
                      </Button>
                    )}
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Table */}
          <Col lg={7}>
            <Card className="admin-table-card border-0 shadow-sm">
              <Card.Header className="bg-dark text-white py-3">
                <Row className="align-items-center">
                  <Col><h4 className="mb-0">📚 Tutorials List</h4></Col>
                  <Col md={5}><Form.Control type="text" placeholder="🔍 Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-dark text-white border-secondary" /></Col>
                </Row>
              </Card.Header>
              <Card.Body className="p-0">
                {filteredTutorials.length === 0 ? (
                  <div className="text-center py-5"><p className="text-muted mb-0">No tutorials yet.</p></div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="admin-table mb-0">
                      <thead className="bg-light">
                        <tr><th>Thumbnail</th><th>Title</th><th>Category</th><th>Date</th><th className="text-center">Actions</th></tr>
                      </thead>
                      <tbody>
                        {filteredTutorials.map(tutorial => (
                          <tr key={tutorial.id}>
                            <td><img src={tutorial.thumbnail} alt={tutorial.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} onError={(e) => e.target.src = 'https://via.placeholder.com/50'} /></td>
                            <td className="fw-bold">{tutorial.title}</td>
                            <td><span className="badge bg-danger px-3 py-2">{tutorial.category}</span></td>
                            <td>{new Date(tutorial.date).toLocaleDateString()}</td>
                            <td className="text-center">
                              <Button variant="warning" size="sm" className="me-2 px-3" onClick={() => handleEdit(tutorial)}><FaEdit className="me-1" /> Edit</Button>
                              <Button variant="danger" size="sm" className="px-3" onClick={() => { setTutorialToDelete(tutorial); setShowDeleteModal(true) }}><FaTrash className="me-1" /> Del</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default Admin