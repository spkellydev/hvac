import React, { useState, useEffect } from 'react';
import SlideRenderer from './SlideRenderer';

let pptFiles = [];

try {
  // Use require.context to load all .json files from src/data/ppt
  // Note: The directory must exist at build time for this to work.
  const context = require.context('../../data/ppt', false, /\.json$/);
  pptFiles = context.keys().map((key) => ({
    fileName: key,
    content: context(key),
  }));
} catch (error) {
  console.warn('Could not load PPT files. Ensure src/data/ppt exists.', error);
}

const PPTViewer = () => {
  const [selectedFile, setSelectedFile] = useState(pptFiles.length > 0 ? pptFiles[0].fileName : '');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [selectedFile]);

  if (pptFiles.length === 0) {
    return (
      <div className="ppt-container">
        <h3>PPT Data</h3>
        <p>No JSON files found in src/data/ppt</p>
      </div>
    );
  }

  const currentFile = pptFiles.find(f => f.fileName === selectedFile);
  let slides = [];

  if (currentFile) {
    if (Array.isArray(currentFile.content)) {
      slides = currentFile.content;
    } else if (currentFile.content && Array.isArray(currentFile.content.slides)) {
      slides = currentFile.content.slides;
    } else {
      slides = [currentFile.content];
    }
  }

  return (
    <div className="ppt-container">
      <h2>PPT Data Viewer</h2>
      
      <div className="chapter-select-container">
        <label htmlFor="chapter-select" className="chapter-select-label">Select Chapter:</label>
        <select 
          id="chapter-select" 
          value={selectedFile} 
          onChange={(e) => setSelectedFile(e.target.value)}
        >
          {pptFiles.map((file) => (
            <option key={file.fileName} value={file.fileName}>{file.content.unit}</option>
          ))}
        </select>
      </div>

      {currentFile && slides.length > 0 && (
        <div className="ppt-card">
          <div className="ppt-card-header">
              {currentFile.content.unit} - Slide {currentSlideIndex + 1} of {slides.length}
          </div>
          <div className="ppt-card-body">
            <SlideRenderer data={slides[currentSlideIndex]} />
          </div>
          <div className="ppt-card-footer">
            <button 
              onClick={() => setCurrentSlideIndex(i => Math.max(0, i - 1))} 
              disabled={currentSlideIndex === 0}
              className="ppt-nav-button"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentSlideIndex(i => Math.min(slides.length - 1, i + 1))} 
              disabled={currentSlideIndex === slides.length - 1}
              className="ppt-nav-button"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PPTViewer;