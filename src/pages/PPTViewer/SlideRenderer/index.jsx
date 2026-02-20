import React from 'react';

const SlideRenderer = ({ data }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === 'string' || typeof data === 'number') {
    return <span>{data}</span>;
  }

  if (Array.isArray(data)) {
    return (
      <ul className="slide-ul">
        {data.map((item, index) => (
          <li key={index} className="slide-li">
            <SlideRenderer data={item} />
          </li>
        ))}
      </ul>
    );
  }

  if (typeof data === 'object') {
    return (
      <div>
        {Object.entries(data).map(([key, value]) => {
          if (key.toLowerCase().includes('title') && typeof value === 'string') {
            return <h3 key={key} className="slide-title">{value}</h3>;
          }
          return (
            <div key={key} className="slide-entry-container">
              <strong className="slide-key-label">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:
              </strong>
              <div className="slide-value-container">
                <SlideRenderer data={value} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export default SlideRenderer;