import React from 'react';
import { loadQuizzes } from '../../data/quizLoader';

export default function QuizSelector({ onSelectQuiz }) {
  const quizzes = loadQuizzes();

  return (
    <div className="quiz-selector-container">
      <h1>Select a Quiz</h1>
      <div className="quiz-list">
        {quizzes.map((quiz) => (
          <button
            key={quiz.id}
            className="quiz-select-btn"
            onClick={() => onSelectQuiz(quiz)}
            style={{
              display: 'block',
              margin: '1rem 0',
              padding: '1rem',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <strong>{quiz.source || quiz.id}</strong>
            <div>{quiz.questions ? `${quiz.questions.length} Questions` : 'No questions'}</div>
          </button>
        ))}
      </div>
    </div>
  );
}