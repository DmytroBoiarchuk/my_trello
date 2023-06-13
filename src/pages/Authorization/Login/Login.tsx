import React, { JSX, useState } from 'react';
import './login.scss';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authorizeFunc } from '../../../common/functions/authorizationFunc';
import Registration from '../Registration/Registration';

export default function Login(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loggingPassword, setLoggingPassword] = useState<string>('');
  const [loggingEmail, setLoggingEmail] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className="login-container">
      {isLogin ? (
        <div className="login-window">
          <h1 className="login-title">Login</h1>
          <input placeholder=" Email" onChange={(e): void => setLoggingEmail(e.target.value)} className="login-input" />
          <input
            placeholder=" Password"
            onChange={(e): void => setLoggingPassword(e.target.value)}
            type="password"
            className="password-input"
          />
          <div className="Error-massage" />
          <button
            onClick={(): void => authorizeFunc(loggingEmail, loggingPassword, dispatch, navigate)}
            className="log-in-button"
          >
            Log in
          </button>
          <a className="sign-up-link" onClick={(): void => setIsLogin(false)}>
            Sign Up
          </a>
        </div>
      ) : (
        <Registration setIsLogin={setIsLogin} />
      )}
    </div>
  );
}
