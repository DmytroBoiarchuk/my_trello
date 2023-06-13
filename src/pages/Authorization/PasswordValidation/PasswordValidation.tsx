import React, { JSX, useEffect, useRef } from 'react';
import './passwordValidation.scss';

export default function PasswordValidation({ myPassword }: { myPassword: string }): JSX.Element {
  const firstBarRef = useRef<HTMLDivElement>(null);
  const secondBarRef = useRef<HTMLDivElement>(null);
  const thirdBarRef = useRef<HTMLDivElement>(null);
  const fourthBarRef = useRef<HTMLDivElement>(null);
  const validationMassageRef = useRef<HTMLHeadingElement>(null);
  const validatePassword = (password: string): void => {
    let passwordStrength = 0;
    if (password.length > 5 && !/[\u0080-\uFFFF]/.test(password)) {
      if (/[0-9]/.test(password)) {
        passwordStrength++;
      }
      if (/[^a-zA-Z0-9]/.test(password)) {
        passwordStrength++;
      }
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
        passwordStrength++;
      }
      if (password.length > 12) {
        passwordStrength++;
      }
    }
    if (
      passwordStrength >= 0 &&
      firstBarRef.current &&
      secondBarRef.current &&
      thirdBarRef.current &&
      fourthBarRef.current &&
      validationMassageRef.current
    ) {
      firstBarRef.current.style.backgroundColor = '#FF0000';
      secondBarRef.current.style.backgroundColor = '#eae4e4';
      thirdBarRef.current.style.backgroundColor = '#eae4e4';
      fourthBarRef.current.style.backgroundColor = '#eae4e4';
      validationMassageRef.current.innerText = 'Weak';
    }
    if (
      passwordStrength === 2 &&
      firstBarRef.current &&
      secondBarRef.current &&
      thirdBarRef.current &&
      fourthBarRef.current &&
      validationMassageRef.current
    ) {
      firstBarRef.current.style.backgroundColor = '#ffbc07';
      secondBarRef.current.style.backgroundColor = '#ffbc07';
      thirdBarRef.current.style.backgroundColor = '#eae4e4';
      fourthBarRef.current.style.backgroundColor = '#eae4e4';
      validationMassageRef.current.innerText = 'Medium';
    }
    if (
      passwordStrength === 3 &&
      firstBarRef.current &&
      secondBarRef.current &&
      thirdBarRef.current &&
      fourthBarRef.current &&
      validationMassageRef.current
    ) {
      firstBarRef.current.style.backgroundColor = '#00e500';
      secondBarRef.current.style.backgroundColor = '#00e500';
      thirdBarRef.current.style.backgroundColor = '#00e500';
      fourthBarRef.current.style.backgroundColor = '#eae4e4';
      validationMassageRef.current.innerText = 'Strong';
    }
    if (
      passwordStrength === 4 &&
      firstBarRef.current &&
      secondBarRef.current &&
      thirdBarRef.current &&
      fourthBarRef.current &&
      validationMassageRef.current
    ) {
      firstBarRef.current.style.backgroundColor = '#00e2ff';
      secondBarRef.current.style.backgroundColor = '#00e2ff';
      thirdBarRef.current.style.backgroundColor = '#00e2ff';
      fourthBarRef.current.style.backgroundColor = '#00e2ff';
      validationMassageRef.current.innerText = 'Strongest';
    }
  };
  useEffect(() => {
    validatePassword(myPassword);
  }, [myPassword]);
  return (
    <div className="password-validation-container">
      <div className="strong-bar-container">
        <div ref={firstBarRef} className="strong-bars" />
        <div ref={secondBarRef} className="strong-bars" />
        <div ref={thirdBarRef} className="strong-bars" />
        <div ref={fourthBarRef} className="strong-bars" />
      </div>
      <h1 ref={validationMassageRef} className="validation-massage">
        Empty
      </h1>
    </div>
  );
}
