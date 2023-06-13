import React, { JSX, useState } from 'react';
import './modal.scss';
import { useDispatch } from 'react-redux';
import { createBoard } from '../../../../store/modules/boards/actions';
import Error from '../Error/Error';
import { inputValidation } from '../../../../common/functions/inputValidation';
import { ModalIsOpen } from '../../../../common/types/types';

function Modal({ openCloseModal }: ModalIsOpen): JSX.Element {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const submitHandler = (e: React.FormEvent): void => {
    e.preventDefault();
  };
  const CreateNew = (): void => {
    if (inputValidation(value)) {
      setError('Invalid symbols, please change name');
      return;
    }
    createBoard(value, dispatch);
    openCloseModal();
  };
  return (
    <div>
      <div className="modal-bg" />
      <div className="modal-window">
        <h1>New board...</h1>
        <div onClick={(): void => openCloseModal()} className="cancel-x">
          &#10006;
        </div>
        <form onSubmit={submitHandler}>
          <input
            autoFocus
            type="text"
            className="input-modal"
            placeholder="Enter name of new board..."
            value={value}
            onChange={(event): void => setValue(event.target.value)}
          />
          {error && <Error error={error} />}
          <button onClick={CreateNew} type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Modal;
