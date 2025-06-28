// src/components/UI/Input.jsx
import React from 'react';

const Input = ({ label, type, value, onChange, placeholder, required = false, style = {} }) => {
  return (
    <div style={{ marginBottom: '15px', textAlign: 'left' }}>
      {label && <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: 'calc(100% - 20px)', // Para dejar espacio al padding
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '16px',
          ...style,
        }}
      />
    </div>
  );
};

export { Input };