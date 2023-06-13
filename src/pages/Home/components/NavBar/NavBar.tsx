import React, { JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navBar.scss';
import { useDispatch } from 'react-redux';
import { logOut } from '../../../../store/modules/user/actions';
import { clearEntireStore } from '../../../../store/modules/boards/actions';
import instance from '../../../../api/request';

function NavBar(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOut = async (): Promise<void> => {
    await logOut();
    instance.defaults.headers.Authorization = `Bearer ${null}`;
    dispatch(clearEntireStore());
    navigate('/login');
  };
  return (
    <div className="nav-bar">
      <Link className="link-bar" to={{ pathname: '/' }}>
        Home
      </Link>
      <button onClick={handleLogOut} className="log-out">
        Log Out
      </button>
    </div>
  );
}

export default NavBar;
