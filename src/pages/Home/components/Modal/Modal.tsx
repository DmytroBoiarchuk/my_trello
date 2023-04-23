import React, { useState } from 'react';
import './modal.scss';
import store from '../../../../store/store';
import { createBoard } from '../../../../store/modules/boards/actions';
import Error from '../Error/Error';
import { validate } from '../../../../common/functions/validate';
interface ModalIsOpen {
  openCloseModal: () => void;
}

const Modal = ({ openCloseModal }: ModalIsOpen) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
  };
  const CreateNew = () => {
    if (validate(value)) {
      setError('Invalid symbols, please change name');
      return;
    }
    store.dispatch(createBoard(value));
    openCloseModal();
  };
  return (
    <>
      <div>
        <div className="modal-bg" />
        <div className="modal-window">
          <h1>New board...</h1>
          <div onClick={() => openCloseModal()} className="cancel-x">
            &#10006;
          </div>
          <form onSubmit={submitHandler}>
            <input
              autoFocus
              type="text"
              className="input-modal"
              placeholder="Enter name of new board..."
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
            {error && <Error error={error} />}
            <button onClick={CreateNew} type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Modal;
