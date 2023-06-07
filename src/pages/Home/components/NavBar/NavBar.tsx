import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import './navBar.scss';

function NavBar(): JSX.Element {
  return (
    <div className="nav-bar">
      <Link className="link-bar" to={{ pathname: '/' }}>
        Home
      </Link>
    </div>
  );
}

export default NavBar;
