import React from 'react';
import { Link } from 'react-router-dom';
import './navBar.scss';
const NavBar = () => {
  return (
    <div className="nav-bar">
      <Link className="link-bar" to={{ pathname: '/' }}>
        Home
      </Link>
    </div>
  );
};

export default NavBar;
