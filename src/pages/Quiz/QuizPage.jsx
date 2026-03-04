import React, { useState, useRef, useEffect } from 'react';
import QuizCard from './QuizCard';
import QuizSelector from '../../components/QuizSelector';

export default function QuizPage() {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState('All');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const questionRefs = useRef([]);

  const questions = activeQuiz ? activeQuiz.questions : [];
  const chapters = [...new Set(questions.map(q => q.chapter))].sort((a, b) => a - b);

  useEffect(() => {
    if (!activeQuiz) return;

    const filtered = selectedChapter === 'All'
      ? questions
      : questions.filter(q => q.chapter === Number(selectedChapter));
    setFilteredQuestions(filtered);
    setCorrectCount(0);
    questionRefs.current = [];
  }, [selectedChapter, activeQuiz]);

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

  if (!activeQuiz) {
    return (
      <QuizSelector onSelectQuiz={(quiz) => {
        setActiveQuiz(quiz);
        setSelectedChapter('All');
        setFilteredQuestions(quiz.questions || []);
        setCorrectCount(0);
      }} />
    );
  }

  return (
    <>
      <button
        onClick={() => setActiveQuiz(null)}
        style={{ marginBottom: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        &larr; Back to Quiz Selection
      </button>
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
  );
}