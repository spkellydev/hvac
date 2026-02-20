import React, { useState } from 'react';
import TroubleshootingStep from '../../components/Troubleshooting/TroubleshootingStep';

const Troubleshooting = () => {
  const [steps, setSteps] = useState([]);

  const handleAddStep = (step) => {
    setSteps([...steps, step]);
  };

  return (
    <div className="container">
      <div className="troubleshooting-page">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Troubleshooting Form</h1>
        
        <div className="steps-display" style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
          {steps.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', padding: '2rem', border: '2px dashed #eee', borderRadius: '8px' }}>
              No steps added yet. Add a step below to begin.
            </div>
          ) : (
            steps.map((step, index) => (
              <div key={index} className="step-card" style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'white',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                borderLeft: '4px solid #4DAFE0'
              }}>
                <div className="step-number" style={{ 
                  fontWeight: 'bold', 
                  color: '#4DAFE0', 
                  marginRight: '1rem',
                  minWidth: '24px'
                }}>
                  {index + 1}
                </div>
                <div className="step-icon" style={{ fontSize: '1.5rem', marginRight: '1rem' }}>
                  {step.icon}
                </div>
                <div className="step-content">
                  {step.sentence}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="add-step-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <TroubleshootingStep onAddStep={handleAddStep} />
        </div>
      </div>
    </div>
  );
};

export default Troubleshooting;