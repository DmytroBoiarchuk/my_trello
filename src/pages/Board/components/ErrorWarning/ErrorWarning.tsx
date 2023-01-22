import React from 'react';
import './errorWarning..scss';
const ErrorWarning = () => {
  return (
    <div className="error-window">
      <p>
        Incorrect Name
        <br /> Please, use "A-Z", "a-z", "_, -" symbols
      </p>
    </div>
  );
};

export default ErrorWarning;
