import React, { useState } from 'react';
import '../Log.css';

const DateComponent = () => {
  const [number, setNumber] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  const handleNumberChange = (event) => {
    const value = event.target.value;
    setNumber(value);
    if (value.length === 10) {
      setValidationMessage('');
    } else {
      setValidationMessage('Please enter a 10-digit number');
    }
  };

  const handleSubmit = () => {
    if (number.length !== 10) {
      setValidationMessage('Please enter a 10-digit number');
    } else {
      setValidationMessage('');
      // Perform any other actions upon valid submission
      console.log('Valid number submitted:', number);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={number}
        onChange={handleNumberChange}
        placeholder="Enter 10-digit number"
      />
      {validationMessage && <p style={{ color: 'red' }}>{validationMessage}</p>}
      <div className="age">
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default DateComponent;
