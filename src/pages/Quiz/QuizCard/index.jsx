import React, { useState, forwardRef } from 'react';

const QuizCard = forwardRef(({ data, onCorrectAnswer }, ref) => {
  const { type, question, options, correct_answer, chapter, id } = data;
  const isMultipleAnswer = Array.isArray(correct_answer);

  const [selectedOption, setSelectedOption] = useState(isMultipleAnswer ? [] : null);
  const [showResult, setShowResult] = useState(false);

  // Determine options based on question type
  const displayOptions = type === 'true_false' ? ['True', 'False'] : options;

  const handleOptionClick = (option) => {
    if (showResult) return;

    if (isMultipleAnswer) {
      setSelectedOption(prev => {
        if (prev.includes(option)) {
          return prev.filter(o => o !== option);
        } else {
          return [...prev, option];
        }
      });
    } else {
      setSelectedOption(option);
    }
  };

  const checkAnswer = () => {
    if (isMultipleAnswer) {
      if (selectedOption.length !== correct_answer.length) return false;
      const sortedSelected = [...selectedOption].sort();
      const sortedCorrect = [...correct_answer].sort();
      return JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);
    }
    return selectedOption === correct_answer;
  };

  const handleSubmit = () => {
    const hasSelection = isMultipleAnswer ? selectedOption.length > 0 : selectedOption;
    if (hasSelection) {
      setShowResult(true);
      if (checkAnswer() && onCorrectAnswer) {
        onCorrectAnswer();
      }
    }
  };

  const isCorrect = showResult && checkAnswer();

  return (
    <div className="quiz-card" ref={ref}>
      <div className="quiz-header">
        <span>Chapter {chapter}</span>
        <span>ID: #{id}</span>
      </div>

      <h3 className="quiz-question">
        {question}
        {isMultipleAnswer && (
          <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginTop: '5px', fontWeight: 'normal' }}>
            (Select all that apply)
          </span>
        )}
      </h3>

      <div className="options-grid">
        {displayOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            className={`option-button 
              ${(isMultipleAnswer ? selectedOption.includes(option) : selectedOption === option) ? 'selected' : ''} 
              ${showResult && (isMultipleAnswer ? correct_answer.includes(option) : option === correct_answer) ? 'correct' : ''} 
              ${showResult && (isMultipleAnswer ? selectedOption.includes(option) && !correct_answer.includes(option) : selectedOption === option && option !== correct_answer) ? 'incorrect' : ''}
            `}
            disabled={showResult}
          >
            {option}
          </button>
        ))}
      </div>

      {!showResult ? (
        <button 
          onClick={handleSubmit} 
          className="submit-btn"
          disabled={isMultipleAnswer ? selectedOption.length === 0 : !selectedOption}
        >
          Check Answer
        </button>
      ) : (
        <div className={isCorrect ? "feedback-success" : "feedback-error"}>
          {isCorrect ? "Correct!" : `Incorrect. The correct answer is: ${isMultipleAnswer ? correct_answer.join(', ') : correct_answer}`}
        </div>
      )}
    </div>
  );
});

export default QuizCard;