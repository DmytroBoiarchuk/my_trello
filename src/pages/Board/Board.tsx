import React, { JSX, useEffect, useState } from 'react';
import './board.scss';
import './components/List/list.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import List from './components/List/List';
import { changeBoardName, getBoard, getBoardTitle, addList } from '../../store/modules/board/actions';
import { IList } from '../../common/interfaces/IList';
import { inputValidation } from '../../common/functions/inputValidation';
import ModalListCreating from './components/Modals/ModalListCreating';
import NavBar from '../Home/components/NavBar/NavBar';
import { RootState } from '../../store/store';
import Loading from './components/Loading/Loading';
import { BoardProps } from '../../common/types/types';
import { useSweetAlert } from '../../common/functions/sweetAlertHandler';

export default function Board(): JSX.Element {
  const { board } = useSelector(
    (state: BoardProps): BoardProps => ({
      board: state.board,
    })
  );
  const { boardId } = useParams();
  const loadingState = useSelector((state: RootState) => state.loading);
  const [boardTitle, setTitle] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [isWarning, setWarning] = useState(false);
  const [listCreatingInput, setListCreatingInput] = useState(false);
  const [cashMemoryListInput, setCashMemoryListInput] = useState('');
  const [listTitle, setListTitle] = useState('');
  const dispatch = useDispatch();
  let listArr = null;
  useEffect(() => {
    getBoardTitle(dispatch, boardId || '').then((resp) => {
      setTitle(resp);
    });
    getBoard(dispatch, boardId || '').catch(() => {
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    });
  }, []);
  if (board.lists) {
    listArr = board.lists.map((key: IList) => (
      <List key={key.id} board_id={boardId || ''} list_id={key.id} title={key.title} />
    ));
  }
  const renameBoard = (value: string): void => {
    if (!inputValidation(value)) {
      setTitle(value);
      setShowInput(false);
      changeBoardName(dispatch, boardId || '', value).catch(() => {
        dispatch({ type: 'ERROR_ACTION_TYPE' });
      });
      return;
    }
    setShowInput(false);
    setTitle(board.title);
    setWarning(true);
    setTimeout(() => setWarning(false), 1500);
  };
  const renameBoardByEnter = (e: React.KeyboardEvent, value: string): void => {
    if (e.key === 'Enter') {
      renameBoard(value);
    }
  };
  const onBlurFunctionList = (value: string): void => {
    setCashMemoryListInput(value);
    setTimeout(() => setListCreatingInput(false), 250);
  };
  const createList = (e: React.FormEvent, value: string): void => {
    if (!inputValidation(value)) {
      addList(dispatch, boardId || '', { title: value, position: 0 }).catch(() => {
        dispatch({ type: 'ERROR_ACTION_TYPE' });
      });
      setCashMemoryListInput('');
      setListTitle('');
      setListCreatingInput(false);
      return;
    }
    e.preventDefault();
    setWarning(true);
    setTimeout(() => setWarning(false), 1500);
  };
  const createListByEnter = (e: React.KeyboardEvent, value: string): void => {
    if (e.key === 'Enter') {
      createList(e, value);
    }
  };
  if (isWarning) {
    useSweetAlert('Prohibited symbols');
    setWarning(false);
  }
  return (
    <>
      <NavBar />
      <div className="board-name-container">
        {showInput && (
          <input
            type="text"
            maxLength={20}
            autoFocus
            className="board-input-boardName"
            defaultValue={boardTitle}
            onKeyDown={(e): void => renameBoardByEnter(e, e.currentTarget.value)}
            onBlur={(e): void => renameBoard(e.currentTarget.value)}
            onChange={(event): void => setTitle(event.target.value)}
          />
        )}
        {!showInput && (
          <h1 className="board-name-h1" onClick={(): void => setShowInput(true)}>
            {boardTitle}
          </h1>
        )}
      </div>
      <div className="list-style">
        {listArr}
        {!listCreatingInput && (
          <button
            disabled={listCreatingInput}
            onClick={(): void => setListCreatingInput(true)}
            className="create-button"
          >
            Create new list
          </button>
        )}
        {listCreatingInput && (
          <ModalListCreating
            listTitle={listTitle}
            buttonOnClick={createList}
            defaultValue={cashMemoryListInput}
            modalTitle="Add list"
            onChange={setListTitle}
            onKeyDown={createListByEnter}
            onBlur={onBlurFunctionList}
          />
        )}
      </div>
      {loadingState.loading && <Loading />}
      <Outlet />
    </>
  );
}
