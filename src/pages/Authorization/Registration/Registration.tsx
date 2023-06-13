import React, { JSX, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PasswordChecklist from 'react-password-checklist';
import PasswordValidation from '../PasswordValidation/PasswordValidation';
import { userRegistration } from '../../../common/functions/authorizationFunc';

export default function Registration({
  setIsLogin,
}: {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registrationPassword, setRegistrationPassword] = useState<string>('');
  const [registrationEmailValid, setRegistrationEmailValid] = useState<boolean>(false);
  const [registrationPasswordValid, setRegistrationPasswordValid] = useState<boolean>(false);
  const [repeatedPassword, setRepeatedPassword] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const validateEmail = (): void => {
    const valid = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+)/;
    if (emailInputRef.current && !valid.test(emailInputRef.current.value)) {
      setRegistrationEmailValid(false);
    } else {
      setRegistrationEmailValid(true);
    }
  };
  useEffect(() => {
    if (registrationEmailValid && registrationPasswordValid) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [registrationEmailValid, registrationPasswordValid]);

  return (
    <div className="login-window">
      <h1 className="login-title">Registration</h1>
      <input placeholder=" Email" ref={emailInputRef} onChange={(): void => validateEmail()} className="login-input" />
      <input
        placeholder=" Password"
        type="password"
        onChange={(e): void => setRegistrationPassword(e.target.value)}
        className="password-input"
      />
      <PasswordValidation myPassword={registrationPassword} />
      <PasswordChecklist
        className="password-check-list"
        rules={['minLength', 'specialChar', 'number', 'capital', 'match']}
        minLength={6}
        value={registrationPassword}
        valueAgain={repeatedPassword}
        onChange={(isValid): void => {
          if (isValid) {
            setRegistrationPasswordValid(true);
          } else {
            setRegistrationPasswordValid(false);
          }
        }}
      />
      <input
        placeholder=" Confirm password"
        onChange={(e): void => setRepeatedPassword(e.target.value)}
        type="password"
        className="password-input"
      />
      <button
        onClick={(): void => {
          if (emailInputRef.current)
            userRegistration(emailInputRef.current.value, registrationPassword, dispatch, navigate);
        }}
        disabled={isButtonDisabled}
        className="log-in-button"
      >
        Sign up
      </button>
      <a className="sign-up-link" onClick={(): void => setIsLogin(true)}>
        Log in
      </a>
    </div>
  );
}
