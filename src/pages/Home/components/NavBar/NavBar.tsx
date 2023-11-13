import React, { JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navBar.scss';
import { useDispatch } from 'react-redux';
import { logOut, setIsAuthorized } from '../../../../store/modules/user/actions';
import { clearEntireStore } from '../../../../store/modules/boards/actions';
import axiosConfig from '../../../../api/request';

function NavBar(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOut = async (): Promise<void> => {
    await logOut();
    axiosConfig.defaults.headers.Authorization = `Bearer ${null}`;
    dispatch(clearEntireStore());
    setIsAuthorized(false);
    navigate('/login');
  };
  return (
    <div className="nav-bar">
      <Link draggable={false} className="link-bar" to={{ pathname: '/' }}>
        Home
      </Link>
      <button onClick={handleLogOut} className="log-out">
        Log Out
      </button>
    </div>
  );
}

export default NavBar;
