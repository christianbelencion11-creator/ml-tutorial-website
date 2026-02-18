import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
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
        <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="navbar-custom">
          <Container>
            <Navbar.Brand as={Link} to="/" className="brand-text">
              <span className="ml-logo">🎮</span> MLBB Academy
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav className="mx-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/tutorials">Tutorials</Nav.Link>
                <Nav.Link as={Link} to="/about">About</Nav.Link>
                <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                <Nav.Link as={Link} to="/admin" className="admin-link">Admin</Nav.Link>
              </Nav>
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search tutorials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
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

        <footer className="footer">
          <Container>
            <p>© 2024 MLBB Academy. All rights reserved.</p>
          </Container>
        </footer>
      </div>
    </Router>
  )
}

export default App