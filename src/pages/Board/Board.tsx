import React, { useEffect, useState } from 'react';
import './board.scss';
import './components/List/list.scss';
import List from './components/List/List';
import { useDispatch, useSelector } from 'react-redux';
import { changeBoardName, getBoard, getBoardTitle } from '../../store/modules/board/actions';
import { IList } from '../../common/interfaces/IList';
import { useParams } from 'react-router-dom';
import { addList } from '../../store/modules/board/actions';
import { BoardProps } from '../../common/interfaces/IBoard';
import { validate } from '../../common/functions/validate';
import ErrorWarning from './components/ErrorWarning/ErrorWarning';
export default function Board() {
  const { board } = useSelector(
    (state: BoardProps): BoardProps => ({
      board: state.board,
    })
  );
  const [boardTitle, setTitle] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [isWarning, setWarning] = useState(false);
  const [listCreatingInput, setListCreatingInput] = useState(false);
  const [cashMemoryListInput, setCashMemoryListInput] = useState('');
  const [listTitle, setListTitle] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    getBoardTitle(dispatch, board_id || '').then((resp) => {
      setTitle(resp);
    });
    getBoard(dispatch, board_id || '');
  }, []);

  let { board_id } = useParams();
  let listArr = null;
  if (board.lists) {
    listArr = board.lists.map((key: IList) => {
      return <List key={key.id} title={key.title} cards={key.cards} />;
    });
  }
  const renameBoardByEnter = (e: React.KeyboardEvent, value: string) => {
    if (e.key === 'Enter') {
      if (!validate(value)) {
        setTitle(value);
        setShowInput(false);
        changeBoardName(dispatch, board_id || '', value);
      } else {
        setTitle(board.title);
        setWarning(true);
        setTimeout(() => setWarning(false), 1500);
      }
    }
  };
  const renameBoard = (value: string) => {
    if (!validate(value)) {
      setTitle(value);
      setShowInput(false);
      changeBoardName(dispatch, board_id || '', value);
    } else {
      setShowInput(false);
      setTitle(board.title);
      setWarning(true);
      setTimeout(() => setWarning(false), 1500);
    }
  };
  const onBlurFunctionList = (value: string) => {
    setCashMemoryListInput(value);
    if (!validate(value)) {
      setTimeout(() => setListCreatingInput(false), 100);
    }
  };
  const createListByEnter = (e: React.KeyboardEvent, value: string) => {
    if (e.key === 'Enter') {
      if (!validate(value)) {
        addList(dispatch, board_id || '', { title: value, position: 0 });
        setCashMemoryListInput('');
        setListCreatingInput(false);
      } else {
        e.preventDefault();
        setWarning(true);
        setTimeout(() => setWarning(false), 1500);
      }
    }
  };
  const createList = (e: React.FormEvent, value: string) => {
    if (!validate(value)) {
      addList(dispatch, board_id || '', { title: value, position: 0 });
      setCashMemoryListInput('');
      setListCreatingInput(false);
    } else {
      e.preventDefault();
      setWarning(true);
      setTimeout(() => setWarning(false), 1500);
    }
  };
  return (
    <>
      {isWarning && <ErrorWarning />}
      <div className="board-name-container">
        {showInput && (
          <input
            type="text"
            maxLength={25}
            autoFocus
            className="board-input-boardName"
            defaultValue={boardTitle}
            onKeyDown={(e) => renameBoardByEnter(e, e.currentTarget.value)}
            onBlur={(e) => renameBoard(e.currentTarget.value)}
            onChange={(event) => setTitle(event.target.value)}
          ></input>
        )}
        {!showInput && <h1 onClick={() => setShowInput(true)}>{boardTitle}</h1>}
      </div>
      <div className="list-style">
        {listArr}
        {!listCreatingInput && (
          <button disabled={listCreatingInput} onClick={() => setListCreatingInput(true)} className="create-button">
            Create new list
          </button>
        )}
        {listCreatingInput && (
          <form className="list-creating-modal-window">
            <input
              type="text"
              maxLength={15}
              autoFocus
              defaultValue={cashMemoryListInput}
              onChange={(e) => {
                setListTitle(e.target.value);
              }}
              className="new-list-input"
              placeholder="Enter name of list..."
              onKeyDown={(e) => createListByEnter(e, e.currentTarget.value)}
              onBlur={(e) => onBlurFunctionList(e.target.value)}
            ></input>
            <button onClick={(e) => createList(e, listTitle)} className="submit-list-button">
              Add list
            </button>
          </form>
        )}
      </div>
    </>
  );
}
