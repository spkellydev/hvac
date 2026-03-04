import React from 'react';
import { loadQuizzes } from '../data/quizLoader';

export default function QuizSelector({ onSelectQuiz }) {
  const quizzes = loadQuizzes();
  const courses = [...new Set(quizzes.map((q) => q.course))];

  const handleSelectCourse = (course) => {
    const courseQuizzes = quizzes.filter((q) => q.course === course);
    const allQuestions = courseQuizzes.reduce((acc, q) => [...acc, ...(q.questions || [])], []);

    onSelectQuiz({
      id: course,
      source: course,
      questions: allQuestions,
    });
  };

  return (
    <div className="quiz-selector-container">
      <h1>Select a Course</h1>
      <div className="quiz-list">
        {courses.map((course) => {
          const courseQuizzes = quizzes.filter((q) => q.course === course);
          const courseName = courseQuizzes.find((q) => q.course_name)?.course_name;
          return (
            <button
              key={course}
              className="quiz-select-btn"
              onClick={() => handleSelectCourse(course)}
              style={{ display: 'block', margin: '1rem 0', padding: '1rem', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <strong>Course: {course}</strong>
              {courseName && <div>{courseName}</div>}
              <div>{courseQuizzes.reduce((acc, q) => acc + (q.questions ? q.questions.length : 0), 0)} Questions</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}