import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FaGamepad, FaSkull, FaFire, FaCrown, FaUserShield } from 'react-icons/fa'
import Home from './components/Home'
import Tutorials from './components/Tutorials'
import About from './components/About'
import Contact from './components/Contact'
import Admin from './components/Admin'
import TutorialDetail from './components/TutorialDetail'

// ✅ Separate inner component so we can use useNavigate inside Router
function AppContent() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate('/tutorials')
    }
  }

  return (
    <div className="App">
      {/* Navigation Bar */}
      <Navbar className="pmc-navbar" expand="lg" fixed="top" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/" className="pmc-brand">
            <img
              src="https://scontent.fmnl30-3.fna.fbcdn.net/v/t39.30808-6/322707149_1841631216235507_1073256195438098560_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=jFDwVIaZtScQ7kNvwEg0lvg&_nc_oc=Adk2WMixZ9b4un2aRcg1Bo7K3kaMNJmIMV4wqchF5p9rIqekrgK3isNqlqtt2O49QrE&_nc_zt=23&_nc_ht=scontent.fmnl30-3.fna&_nc_gid=27SX6zTygGpOBStnP2yJgA&oh=00_AftJl8UEOFcZHUI1yIMRP477cjCcJJ4nk6nKnaMx_a5n4A&oe=699B876C"
              alt="PMC Gaming Logo"
              className="pmc-logo-img"
            />
            <div className="brand-text-wrapper">
              <span className="brand-text">PMC GAMING</span>
              <span className="brand-tag">TUTORIALS</span>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="pmc-nav" />
          <Navbar.Collapse id="pmc-nav">
            <Nav className="mx-auto pmc-nav-links">
              <Nav.Link as={Link} to="/" className="nav-item">
                <FaFire className="nav-icon" /> HOME
              </Nav.Link>
              <Nav.Link as={Link} to="/tutorials" className="nav-item">
                <FaGamepad className="nav-icon" /> TUTORIALS
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="nav-item">
                <FaCrown className="nav-icon" /> ABOUT
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="nav-item">
                <FaSkull className="nav-icon" /> CONTACT
              </Nav.Link>
            </Nav>

            {/* Search Box */}
            <div className="nav-right">
              <div className="pmc-search">
                <input
                  type="text"
                  placeholder="SEARCH TUTORIALS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="pmc-search-input"
                />
              </div>
              <Nav.Link as={Link} to="/admin" className="pmc-admin-btn">
                <FaUserShield className="admin-btn-icon" />
                <span className="admin-btn-text">ADMIN</span>
              </Nav.Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="mt-5 pt-5 main-content">
        <Routes>
          <Route path="/" element={<Home searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
          <Route path="/tutorials" element={<Tutorials searchTerm={searchTerm} />} />
          <Route path="/tutorial/:id" element={<TutorialDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Container>

      <footer className="pmc-footer">
        <Container>
          <p>⚔️ 2025 PMC GAMING TUTORIALS ⚔️</p>
          <p className="footer-tag">LEVEL UP YOUR GAME</p>
        </Container>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
