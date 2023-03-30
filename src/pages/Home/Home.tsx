import React, { useEffect, useRef, useState } from 'react';
import BoardAtHome from './components/BoardAtHome/BoardAtHome';
import './home.scss';
import { BoardProps, BoardsProps, IBoard, ReturnType } from '../../common/interfaces/IBoard';
import { useDispatch, useSelector } from 'react-redux';
import { getBoards } from '../../store/modules/boards/actions';
import store, { RootState } from '../../store/store';
import Modal from './components/Modal/Modal';
import NavBar from './components/NavBar/NavBar';
import LoadingP from '../Board/components/Loading/LoadingP';

export default function Home() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  let loadingState = useSelector((state: RootState) => state.loading);
  const dispatch = useDispatch();
  const { boards } = useSelector(
    (state: BoardsProps): ReturnType => ({
      boards: state.boards.boards,
    })
  );
  let boardArr = null;
  if (boards) {
    boardArr = boards.map((board: IBoard) => {
      return <BoardAtHome key={board.id} id={board.id} title={board.title}></BoardAtHome>;
    });
  }
  useEffect(() => {
    getBoards(dispatch);
  }, []);
  return (
    <>
      <NavBar />
      <h1>My Boards</h1>
      <div className="home-style">
        {boardArr}
        <button onClick={() => setModalIsOpen(true)} className="add-board-button">
          + Add new Board
        </button>
        {modalIsOpen && <Modal openCloseModal={() => setModalIsOpen(false)} />}
      </div>
      {loadingState.loading && <LoadingP />}
    </>
  );
}
