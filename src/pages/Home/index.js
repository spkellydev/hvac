import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Quiz Machine</h1>
      <p className="home-description">Select a mode to get started:</p>
      <div className="home-links">
        <Link to="/quiz" className="home-card">
          <h2>Take a Quiz</h2>
          <p>Test your knowledge with chapter-based quizzes.</p>
        </Link>
        <Link to="/ppt" className="home-card">
          <h2>View Slides</h2>
          <p>Review presentation slides for each chapter.</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;