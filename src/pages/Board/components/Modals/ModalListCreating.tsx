import React, { JSX } from 'react';

function ModalListCreating({
  listTitle,
  buttonOnClick,
  defaultValue,
  modalTitle,
  onChange,
  onKeyDown,
  onBlur,
}: {
  listTitle: string;
  buttonOnClick: (e: React.FormEvent, value: string) => void;
  defaultValue: string;
  modalTitle: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onKeyDown: (e: React.KeyboardEvent, value: string) => void;
  onBlur: (value: string) => void;
}): JSX.Element {
  return (
    <div>
      <form className="list-creating-modal-window">
        <input
          type="text"
          maxLength={16}
          autoFocus
          defaultValue={defaultValue}
          onChange={(e): void => {
            onChange(e.target.value);
          }}
          className="new-list-input"
          placeholder="Enter name of list..."
          onKeyDown={(e): void => onKeyDown(e, e.currentTarget.value)}
          onBlur={(e): void => onBlur(e.target.value)}
        />
        <button type="button" onClick={(e): void => buttonOnClick(e, listTitle)} className="submit-list-button">
          {modalTitle}
        </button>
      </form>
    </div>
  );
}

export default ModalListCreating;
