import React from 'react';
import './loading.scss';
import { BiLoaderCircle } from 'react-icons/bi';
const LoadingP = () => {
  return (
    <div className="modal-body">
      <div className="loading">
        <p>Loading...</p>
        <BiLoaderCircle className="loading-logo" />
      </div>
    </div>
  );
};

export default LoadingP;
