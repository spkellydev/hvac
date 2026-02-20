import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './App.scss';
import './assets/styles.scss';
import data_set from './data/course4.json';
import QuizCard from './pages/Quiz/QuizCard';
import PPTViewer from './pages/PPTViewer';
import HeatLoadCalculator from './pages/heat_load/HeatLoadCalculator';
import Home from './pages/Home';
import Troubleshooting from './pages/Troubleshooting';

const questions = data_set.questions; 

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
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState('All');
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  const questionRefs = useRef([]);

  const chapters = [...new Set(questions.map(q => q.chapter))].sort((a, b) => a - b);

  useEffect(() => {
    const filtered = selectedChapter === 'All'
      ? questions
      : questions.filter(q => q.chapter === Number(selectedChapter));
    setFilteredQuestions(filtered);
    setCorrectCount(0);
    questionRefs.current = [];
  }, [selectedChapter]);

  const handleShuffle = () => {
    setFilteredQuestions(prev => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    setCorrectCount(0);
    questionRefs.current = [];
  };

  const handleCorrectAnswer = (index) => {
    setCorrectCount(c => c + 1);
    const nextIndex = index + 1;
    if (nextIndex < filteredQuestions.length && questionRefs.current[nextIndex]) {
      questionRefs.current[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={
            <>
              <div className="chapter-select-container">
                <label htmlFor="chapter-select" className="chapter-select-label">Filter by Chapter:</label>
                <select 
                  id="chapter-select" 
                  value={selectedChapter} 
                  onChange={(e) => setSelectedChapter(e.target.value)}
                >
                  <option value="All">All Chapters</option>
                  {chapters.map(ch => <option key={ch} value={ch}>Chapter {ch}</option>)}
                </select>
                <button onClick={handleShuffle} className="shuffle-btn">Shuffle Questions</button>
              </div>
              <p>Total Questions: {filteredQuestions.length} | Correct: {correctCount}</p>
              {filteredQuestions.map((q, index) => <QuizCard key={q.id} ref={el => questionRefs.current[index] = el} data={q} onCorrectAnswer={() => handleCorrectAnswer(index)} />)}
            </>
          } />
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
