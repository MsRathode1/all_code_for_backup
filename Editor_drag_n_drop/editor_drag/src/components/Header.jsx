import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <h1>Form Builder</h1>
      <button>Undo</button>
      <button>Redo</button>
      <select>
        <option value="A4">A4</option>
        <option value="Letter">Letter</option>
      </select>
    </header>
  );
};

export default Header;
