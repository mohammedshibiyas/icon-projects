import React, { useState } from 'react';
import './Log.css';

function NotchedInput({ label, type, id }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(value !== '');
  const handleChange = (e) => setValue(e.target.value);

  return (
    <div className={`form-group ${focused || value ? 'focused' : ''}`}>
      <input
        type={type}
        className="form-control"
        id={id}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
        placeholder="hello "
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <NotchedInput label="Email" type="email" id="floatingEmail" />
      <NotchedInput label="Password" type="password" id="floatingPassword" />
    </div>
  );
}

export default App;
