import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FaGamepad, FaFire, FaCrown, FaUserShield, FaCommentDots, FaYoutube, FaFacebook, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import Home from './components/Home'
import Tutorials from './components/Tutorials'
import About from './components/About'
import Contact from './components/Contact'
import Admin from './components/Admin'
import TutorialDetail from './components/TutorialDetail'

function AppContent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [navExpanded, setNavExpanded] = useState(false)
  const navigate = useNavigate()

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate('/tutorials')
      setNavExpanded(false)
    }
  }

  const handleNavClick = () => setNavExpanded(false)

  return (
    <div className="App">
      <Navbar
        className="pmc-navbar"
        expand="lg"
        fixed="top"
        variant="dark"
        expanded={navExpanded}
        onToggle={(expanded) => setNavExpanded(expanded)}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="pmc-brand" onClick={handleNavClick}>
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
              <Nav.Link as={Link} to="/" className="nav-item" onClick={handleNavClick}>
                <FaFire className="nav-icon" /> HOME
              </Nav.Link>
              <Nav.Link as={Link} to="/tutorials" className="nav-item" onClick={handleNavClick}>
                <FaGamepad className="nav-icon" /> TUTORIALS
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="nav-item" onClick={handleNavClick}>
                <FaCrown className="nav-icon" /> ABOUT
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="nav-item" onClick={handleNavClick}>
                <FaCommentDots className="nav-icon" /> CONTACT
              </Nav.Link>
            </Nav>

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
              <Nav.Link as={Link} to="/admin" className="pmc-admin-btn" onClick={handleNavClick}>
                <FaUserShield className="admin-btn-icon" />
                <span className="admin-btn-text">ADMIN</span>
              </Nav.Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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

      {/* ===== PROFESSIONAL FOOTER ===== */}
      <footer className="pmc-footer">
        <Container>
          <div className="footer-top">
            <Row>

              {/* Brand + Description */}
              <Col lg={4} md={6} className="mb-4 mb-lg-0">
                <div className="footer-brand">
                  <img
                    src="https://scontent.fmnl30-3.fna.fbcdn.net/v/t39.30808-6/322707149_1841631216235507_1073256195438098560_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=jFDwVIaZtScQ7kNvwEg0lvg&_nc_oc=Adk2WMixZ9b4un2aRcg1Bo7K3kaMNJmIMV4wqchF5p9rIqekrgK3isNqlqtt2O49QrE&_nc_zt=23&_nc_ht=scontent.fmnl30-3.fna&_nc_gid=27SX6zTygGpOBStnP2yJgA&oh=00_AftJl8UEOFcZHUI1yIMRP477cjCcJJ4nk6nKnaMx_a5n4A&oe=699B876C"
                    alt="PMC Gaming"
                    className="footer-logo"
                  />
                  <div>
                    <div className="footer-brand-text">PMC GAMING</div>
                    <div className="footer-brand-tag">TUTORIALS</div>
                  </div>
                </div>
                <p className="footer-desc">
                  Your go-to source for Mobile Legends Bang Bang tutorials, hero guides, and pro strategies. Level up your game with PMC Gaming.
                </p>
                {/* Social Links */}
                <div className="footer-social">
                  <a href="https://www.youtube.com/@PMCGaming8" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="YouTube">
                    <FaYoutube />
                  </a>
                  <a href="https://www.facebook.com/realpmcgaming" className="footer-social-btn" title="Facebook">
                    <FaFacebook />
                  </a>
                  <a href="/contact" className="footer-social-btn" title="Contact">
                    <FaEnvelope />
                  </a>
                </div>
              </Col>

              {/* Quick Links */}
              <Col lg={2} md={6} sm={6} className="mb-4 mb-lg-0">
                <h6 className="footer-heading">QUICK LINKS</h6>
                <ul className="footer-links">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/tutorials">Tutorials</Link></li>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </Col>

              {/* Categories */}
              <Col lg={3} md={6} sm={6} className="mb-4 mb-lg-0">
                <h6 className="footer-heading">CATEGORIES</h6>
                <ul className="footer-links">
                  <li><Link to="/tutorials">Hero Guides</Link></li>
                  <li><Link to="/tutorials">Builds</Link></li>
                  <li><Link to="/tutorials">Pro Strategies</Link></li>
                  <li><Link to="/tutorials">Team Tactics</Link></li>
                  <li><Link to="/tutorials">Tips & Tricks</Link></li>
                </ul>
              </Col>

              {/* Contact Info */}
              <Col lg={3} md={6}>
                <h6 className="footer-heading">CONTACT US</h6>
                <div className="footer-contact-item">
                  <FaYoutube className="footer-contact-icon" />
                  <span>youtube.com/@PMCGaming8</span>
                </div>
                <div className="footer-contact-item">
                  <FaEnvelope className="footer-contact-icon" />
                  <span>pmcgamingp@gmail.com</span>
                </div>
                <div className="footer-contact-item">
                  <FaMapMarkerAlt className="footer-contact-icon" />
                  <span>Philippines</span>
                </div>
              </Col>

            </Row>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2026 <span>PMC GAMING TUTORIALS</span>. All rights reserved.
            </p>
            <p className="footer-tag">⚔️ SAFEST TUTORIAL CHANNEL ⚔️</p>
          </div>
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