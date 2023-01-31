import React, { useEffect, useRef, useState } from 'react';
import BoardAtHome from './components/BoardAtHome/BoardAtHome';
import './home.scss';
import { IBoard } from '../../common/interfaces/IBoard';
import { connect } from 'react-redux';
import { getBoards } from '../../store/modules/boards/actions';
import store from '../../store/store';
import Modal from './components/Modal/Modal';
import { propsType } from '../../common/types/types';
import { stateType } from '../../common/types/types';
import NavBar from './components/NavBar/NavBar';

function Home(props: propsType) {
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
    </>
  );
}
const mapStateToProps = (state: stateType) => ({
  ...state.boards,
});
export default connect(mapStateToProps, { getBoards })(Home);
