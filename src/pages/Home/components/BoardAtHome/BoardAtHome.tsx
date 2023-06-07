import React, { JSX } from 'react';
import './boardAtHome.scss';
import { Link } from 'react-router-dom';
import { deleteBoard } from '../../../../store/modules/boards/actions';
import store from '../../../../store/store';

function BoardAtHome({ id, title }: { id: number; title: string }): JSX.Element {
  return (
    <Link className="home-board-style" to={{ pathname: `/board/${id}` }} state={id}>
      <p>{title}</p>
      <div
        className="delete-board"
        onClick={(e): void => {
          e.preventDefault();
          store.dispatch(deleteBoard(id));
        }}
      >
        Delete Board
      </div>
    </Link>
  );
}

export default BoardAtHome;
