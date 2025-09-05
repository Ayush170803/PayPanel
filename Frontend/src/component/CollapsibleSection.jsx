import React, { useState } from 'react';

const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapsible-section">
      <div
        className="section-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4>{title}</h4>
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && <div className="section-body">{children}</div>}
    </div>
  );
};

export default CollapsibleSection;
