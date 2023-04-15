import React from 'react';
import { GrClose } from 'react-icons/gr';

const ModalInModal = (props: {
  isCopying: boolean;
  list_id: string;
  board_id: string;
  selectors_board: JSX.Element[] | undefined;
  selectorsLists: any;
  selectorsPoses: Array<JSX.Element>;
  position: number;
  selectBoardHandler: Function;
  selectListHandler: Function;
  movementHandler: Function;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div>
      <div className="moving-card-modal">
        <div className="title-container-small-modal">
          <p className="big-text">{props.isCopying ? 'Card Copying' : 'Card Moving'}</p>
          <GrClose className="cross-to-exit" onClick={() => props.setIsShow(false)} />
        </div>
        <hr className="hr-style" />
        {props.isCopying && (
          <div>
            <textarea
              id="title_for_copy"
              autoFocus={true}
              className="copied-card-name-input"
              placeholder="Enter card name..."
            ></textarea>
          </div>
        )}
        <p className="small-text">Select column</p>
        <div className="chosen-column board-modal">
          <p className="small-text inside">Board</p>
          <select
            onChange={() => props.selectBoardHandler()}
            defaultValue={props.board_id}
            id="selector_board"
            className="selection small-text custom-text"
          >
            {props.selectors_board}
          </select>
        </div>
        <div className="chosen-columns-container">
          <div className="chosen-column list-modal">
            <p className="small-text inside">List</p>
            <select
              defaultValue={props.list_id}
              onChange={() => props.selectListHandler()}
              className="selection list-size small-text custom-text"
            >
              {props.selectorsLists}
            </select>
          </div>
          <div className="chosen-column position-modal">
            <p className="small-text inside">Position</p>
            <select defaultValue={props.position} className="selection pos-size small-text custom-text">
              {props.selectorsPoses}
            </select>
          </div>
        </div>
        <button onClick={() => props.movementHandler()} className="move-button">
          {props.isCopying ? 'COPY' : 'MOVE'}
        </button>
      </div>
    </div>
  );
};

export default ModalInModal;
