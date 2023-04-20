import React from 'react';

const ModalListCreating = (props: {
  listTitle: string;
  buttonOnClick: (e: React.FormEvent, value: string) => void;
  defaultValue: string;
  modalTitle: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onKeyDown: (e: React.KeyboardEvent, value: string) => void;
  onBlur: (value: string) => void;
}) => {
  return (
    <div>
      <form className="list-creating-modal-window">
        <input
          type="text"
          maxLength={16}
          autoFocus
          defaultValue={props.defaultValue}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
          className="new-list-input"
          placeholder="Enter name of list..."
          onKeyDown={(e) => props.onKeyDown(e, e.currentTarget.value)}
          onBlur={(e) => props.onBlur(e.target.value)}
        ></input>
        <button type={'button'} onClick={(e) => props.buttonOnClick(e, props.listTitle)} className="submit-list-button">
          {props.modalTitle}
        </button>
      </form>
    </div>
  );
};

export default ModalListCreating;
