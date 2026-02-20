import React, { useState } from 'react';

const TroubleshootingStep = ({ onAddStep }) => {
  const [icon, setIcon] = useState('🔧');
  const [sentence, setSentence] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAddStep) {
      onAddStep({ icon, sentence });
    }
    console.log('Step added:', { icon, sentence });
    setSentence('');
  };

  return (
    <div className="troubleshooting-step-form">
      <h3>Add Troubleshooting Step</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="icon-select" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Select Icon:
          </label>
          <select
            id="icon-select"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1.2rem' }}
          >
            <option value="🔧">🔧 Tool</option>
            <option value="⚠️">⚠️ Warning</option>
            <option value="✅">✅ Success</option>
            <option value="❌">❌ Error</option>
            <option value="ℹ️">ℹ️ Info</option>
            <option value="🔥">🔥 Heat</option>
            <option value="❄️">❄️ Cold</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="sentence-input" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Sentence:
          </label>
          <input
            type="text"
            id="sentence-input"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder="Enter troubleshooting instruction..."
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" className="submit-btn">Add Step</button>
      </form>
    </div>
  );
};

export default TroubleshootingStep;