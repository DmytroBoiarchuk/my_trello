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
import ModalCreating from './components/ModalCreating/ModalCreating';
import NavBar from '../Home/components/NavBar/NavBar';
import { RootState } from '../../store/store';
import LoadingP from './components/Loading/LoadingP';

export default function Board() {
  const { board } = useSelector(
    (state: BoardProps): BoardProps => ({
      board: state.board,
    })
  );
  let loadingState = useSelector((state: RootState) => state.loading);
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
      return <List key={key.id} board_id={board_id || ''} list_id={key.id} title={key.title} cards={key.cards} />;
    });
  }
  const renameBoardByEnter = (e: React.KeyboardEvent, value: string) => {
    if (e.key === 'Enter') {
      if (value === boardTitle) {
        setShowInput(false);
        return;
      }
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
    if (value === boardTitle) {
      setShowInput(false);
      return;
    }
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
    setTimeout(() => setListCreatingInput(false), 100);
  };
  const createListByEnter = (e: React.KeyboardEvent, value: string) => {
    if (e.key === 'Enter') {
      if (!validate(value)) {
        addList(dispatch, board_id || '', { title: value, position: 0 });
        setCashMemoryListInput('');
        setListTitle('');
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
      setListTitle('');
      setListCreatingInput(false);
    } else {
      e.preventDefault();
      setWarning(true);
      setTimeout(() => setWarning(false), 1500);
    }
  };
  return (
    <>
      <NavBar />
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
          <ModalCreating
            listTitle={listTitle}
            buttonOnClick={createList}
            defaultValue={cashMemoryListInput}
            modalTitle="Add List"
            onChange={setListTitle}
            onKeyDown={createListByEnter}
            onBlur={onBlurFunctionList}
          />
        )}
      </div>
      {loadingState.loading && <LoadingP />}
    </>
  );
}
