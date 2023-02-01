import React, { useEffect, useRef, useState } from 'react';
import BoardAtHome from './components/BoardAtHome/BoardAtHome';
import './home.scss';
import { IBoard } from '../../common/interfaces/IBoard';
import { connect, useSelector } from 'react-redux';
import { getBoards } from '../../store/modules/boards/actions';
import store, { RootState } from '../../store/store';
import Modal from './components/Modal/Modal';
import { propsType } from '../../common/types/types';
import { stateType } from '../../common/types/types';
import NavBar from './components/NavBar/NavBar';
import LoadingP from '../Board/components/Loading/LoadingP';

function Home(props: propsType) {
  let loadingState = useSelector((state: RootState) => state.loading);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  useEffect(() => {
    store.dispatch(getBoards());
  }, []);

  return (
    <>
      <NavBar />
      <h1>My Boards</h1>
      <div className="home-style">
        {props.boards.map((board: IBoard) => {
          return <BoardAtHome key={board.id} id={board.id} title={board.title}></BoardAtHome>;
        })}
        <button onClick={() => setModalIsOpen(true)} className="add-board-button">
          + Add new Board
        </button>
        {modalIsOpen && <Modal openCloseModal={() => setModalIsOpen(false)} />}
      </div>
      {loadingState.loading && <LoadingP />}
    </>
  );
}
const mapStateToProps = (state: stateType) => ({
  ...state.boards,
});
export default connect(mapStateToProps, { getBoards })(Home);
