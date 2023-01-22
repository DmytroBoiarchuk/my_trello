import React from 'react';
import './error.scss';
const Error = (props: { error: string }) => {
  return <p className="error-massage">{props.error}</p>;
};

export default Error;
