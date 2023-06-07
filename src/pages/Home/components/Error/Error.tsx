import React, { JSX } from 'react';
import './error.scss';

function Error({ error }: { error: string }): JSX.Element {
  return <p className="error-massage">{error}</p>;
}

export default Error;
