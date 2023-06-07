import React, { JSX, forwardRef, useRef, useImperativeHandle } from 'react';
import { GrClose } from 'react-icons/gr';
import { ReplacingCardModalProps, ReplacingCardModalRef } from '../../../../common/types/types';

const ReplacingCardModal = forwardRef<ReplacingCardModalRef, ReplacingCardModalProps>(
  (
    {
      defaultValueForCopying,
      isCopying,
      list_id,
      board_id,
      selectors_board,
      selectorsLists,
      selectorsPoses,
      position,
      selectBoardHandler,
      selectListHandler,
      movementHandler,
      setIsShow,
    },
    ref
  ): JSX.Element => {
    const boardSelectorRef = useRef<HTMLSelectElement>(null);
    const listSelectorRef = useRef<HTMLSelectElement>(null);
    const positionsSelectorRef = useRef<HTMLSelectElement>(null);
    const titleForCopyInputRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      boardSelectorRef: boardSelectorRef.current,
      listSelectorRef: listSelectorRef.current,
      positionsSelectorRef: positionsSelectorRef.current,
      titleForCopyInputRef: titleForCopyInputRef.current,
    }));
    return (
      <div>
        <div className="moving-card-modal">
          <div className="title-container-small-modal">
            <p className="big-text">{isCopying ? 'Card Copying' : 'Card Moving'}</p>
            <GrClose className="cross-to-exit" onClick={(): void => setIsShow(false)} />
          </div>
          <hr className="hr-style" />
          {isCopying && (
            <div>
              <textarea
                ref={titleForCopyInputRef}
                id="title_for_copy"
                defaultValue={defaultValueForCopying}
                autoFocus
                className="copied-card-name-input"
                placeholder="Enter card name..."
              />
            </div>
          )}
          <p className="small-text">Select column</p>
          <div className="chosen-column board-modal">
            <p className="small-text inside">Board</p>
            <select
              ref={boardSelectorRef}
              onChange={(): void => selectBoardHandler()}
              defaultValue={board_id}
              id="selector_board"
              className="selection small-text custom-text"
            >
              <optgroup label="Your Boards">{selectors_board}</optgroup>
            </select>
          </div>
          <div className="chosen-columns-container">
            <div className="chosen-column list-modal">
              <p className="small-text inside">List</p>
              <select
                ref={listSelectorRef}
                defaultValue={list_id}
                onChange={(): void => selectListHandler()}
                className="selection list-size small-text custom-text"
              >
                {selectorsLists}
              </select>
            </div>
            <div className="chosen-column position-modal">
              <p className="small-text inside">Position</p>
              <select
                ref={positionsSelectorRef}
                defaultValue={position}
                className="selection pos-size small-text custom-text"
              >
                {selectorsPoses}
              </select>
            </div>
          </div>
          <button onClick={movementHandler} className="move-button">
            {isCopying ? 'COPY' : 'MOVE'}
          </button>
        </div>
      </div>
    );
  }
);
ReplacingCardModal.displayName = 'ReplacingCardModal';

export default ReplacingCardModal;
