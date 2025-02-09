import React, { useState } from 'react';

const DropdownCrypto = ({ options, onOptionSelect }) => {
  // State to store the current text input
  const [inputValue, setInputValue] = useState('WBNB');
  // State to control the dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle input changes: update the text and open/close the dropdown
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    setIsDropdownOpen(Boolean(value));
  };

  // When an option is clicked, update the input and notify the parent
  const handleOptionClick = (option) => {
    setInputValue(option);
    setIsDropdownOpen(false);
    // Pass the chosen option to the parent component
    if (onOptionSelect) {
      onOptionSelect(option);
    }
  };

  // Filter options based on the input (case-insensitive)
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', width: '300px', margin: '0 auto' }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => inputValue && setIsDropdownOpen(true)}
        placeholder="Type to filter options..."
        style={{
          width: '100%',
          padding: '8px',
          fontSize: '16px',
          boxSizing: 'border-box',
        }}
      />

      {isDropdownOpen && inputValue && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#242424',
            border: '1px solid #ccc',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            zIndex: 1000,
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index} // In production, use a unique identifier
                onClick={() => handleOptionClick(option)}
                style={{
                  padding: '8px',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                }}
              >
                {option}
              </li>
            ))
          ) : (
            <li style={{ padding: '8px', color: '#999' }}>
              No matching options
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default DropdownCrypto;
