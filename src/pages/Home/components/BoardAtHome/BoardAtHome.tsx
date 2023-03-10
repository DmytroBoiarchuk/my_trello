import React from 'react';
import './boardAtHome.scss';
import { Link, Route, Routes } from 'react-router-dom';
import { deleteBoard } from '../../../../store/modules/boards/actions';
import store from '../../../../store/store';
import Board from '../../../Board/Board';
import { useDispatch } from 'react-redux';
import { type } from 'os';

const BoardAtHome = (props: { id: number; title: string }) => {
  return (
    <>
      <Link className="home-board-style" to={{ pathname: '/board/' + props.id }} state={props.id}>
        <p>{props.title}</p>
        <div
          className="delete-board"
          onClick={(e) => {
            e.preventDefault();
            store.dispatch(deleteBoard(props.id));
          }}
        >
          Delete Board
        </div>
      </Link>
    </>
  );
};

export default BoardAtHome;
