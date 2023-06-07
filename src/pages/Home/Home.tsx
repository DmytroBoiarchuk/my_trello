import React, { JSX, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BoardAtHome from './components/BoardAtHome/BoardAtHome';
import './home.scss';
import { IBoard, BoardsInterface } from '../../common/interfaces/IBoard';
import { getBoards } from '../../store/modules/boards/actions';
import { RootState } from '../../store/store';
import Modal from './components/Modal/Modal';
import NavBar from './components/NavBar/NavBar';
import Loading from '../Board/components/Loading/Loading';
import { clearStore } from '../../store/modules/board/actions';
import { BoardsProps } from '../../common/types/types';

export default function Home(): JSX.Element {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const loadingState = useSelector((state: RootState) => state.loading);
  const dispatch = useDispatch();
  const { boards } = useSelector(
    (state: BoardsProps): BoardsInterface => ({
      boards: state.boards.boards,
    })
  );
  let boardArr = null;
  if (boards) {
    boardArr = boards.map((board: IBoard) => <BoardAtHome key={board.id} id={board.id} title={board.title} />);
  }
  useEffect(() => {
    getBoards(dispatch);
    dispatch(clearStore());
  }, []);
  return (
    <>
      <NavBar />
      <h1 className="main-title">My Boards</h1>
      <div className="home-style">
        {boardArr}
        <button onClick={(): void => setModalIsOpen(true)} className="add-board-button">
          + Add New Board
        </button>
        {modalIsOpen && <Modal openCloseModal={(): void => setModalIsOpen(false)} />}
      </div>
      {loadingState.loading && <Loading />}
    </>
  );
}
