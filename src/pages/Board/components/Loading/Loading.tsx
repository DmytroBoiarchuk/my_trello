import React, { JSX } from 'react';
import './loading.scss';
import { BiLoaderCircle } from 'react-icons/bi';

function Loading(): JSX.Element {
  return (
    <div className="modal-body">
      <div className="loading">
        <p>Loading...</p>
        <BiLoaderCircle className="loading-logo" />
      </div>
    </div>
  );
}

export default Loading;
