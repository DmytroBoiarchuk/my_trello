import React, { JSX } from 'react';
import './pageNotFound.scss';
import { useNavigate } from 'react-router-dom';

function PageNotfound(): JSX.Element {
  const navigate = useNavigate();
  return (
    <div className="page-not-found-container">
      <div className="OOPS-image" />
      <button onClick={(): void => navigate('/')} className="return-button">
        Return to Home Page
      </button>
    </div>
  );
}

export default PageNotfound;
