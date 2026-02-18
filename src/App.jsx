import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import { FaGamepad, FaSkull, FaFire, FaCrown } from 'react-icons/fa'
import Home from './components/Home'
import Tutorials from './components/Tutorials'
import About from './components/About'
import Contact from './components/Contact'
import Admin from './components/Admin'
import TutorialDetail from './components/TutorialDetail'

function App() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <Router>
      <div className="App">
        {/* UPDATED NAVIGATION - PMC GAMING THEME */}
        <Navbar className="pmc-navbar" expand="lg" fixed="top" variant="dark">
          <Container>
            <Navbar.Brand as={Link} to="/" className="pmc-brand">
              <FaSkull className="brand-icon" />
              <span className="brand-text">PMC GAMING</span>
              <span className="brand-tag">TUTORIALS</span>
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
              <div className="pmc-search">
                <input 
                  type="text" 
                  placeholder="SEARCH TUTORIALS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pmc-search-input"
                />
              </div>

              {/* Admin Button - NAKAHIWALAY SA RIGHT */}
              <Nav.Link as={Link} to="/admin" className="pmc-admin-btn">
                <FaSkull /> ADMIN
              </Nav.Link>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-5 pt-5 main-content">
          <Routes>
            <Route path="/" element={<Home />} />
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
    </Router>
  )
}

export default App