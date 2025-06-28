// src/components/UI/Button.jsx
import React from 'react';

const Button = ({ children, onClick, type = 'button', disabled = false, style = {} }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '16px',
        marginTop: '10px',
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export { Button };