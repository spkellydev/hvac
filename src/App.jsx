import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './App.scss';
import './assets/styles.scss';
import QuizPage from './pages/Quiz/QuizPage';
import PPTViewer from './pages/PPTViewer';
import HeatLoadCalculator from './pages/heat_load/HeatLoadCalculator';
import Home from './pages/Home';
import Troubleshooting from './pages/Troubleshooting';

const Navigation = () => {
  const location = useLocation();
  const { pathname } = location;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="nav-toggle-btn" 
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
      >
        ☰
      </button>
      
      {isOpen && <div className="nav-overlay" onClick={() => setIsOpen(false)} />}

      <nav className={`app-nav ${isOpen ? 'open' : ''}`}>
        <button className="nav-close-btn" onClick={() => setIsOpen(false)} aria-label="Close navigation menu">
          &times;
        </button>
        <Link to="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/quiz" className={`nav-link ${pathname === '/quiz' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Quiz</Link>
        <Link to="/ppt" className={`nav-link ${pathname === '/ppt' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>PPT Viewer</Link>
        <Link to="/heat-load" className={`nav-link ${pathname === '/heat-load' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Heat Load Calculator</Link>
        <Link to="/troubleshooting" className={`nav-link ${pathname === '/troubleshooting' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Troubleshooting</Link>
      </nav>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/ppt" element={<PPTViewer />} />
          <Route path="/heat-load" element={<HeatLoadCalculator />} />
          <Route path="/troubleshooting" element={<Troubleshooting />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
