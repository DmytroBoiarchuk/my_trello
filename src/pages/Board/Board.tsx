import React, { ReactNode } from 'react';
import './components/Board/board.scss';
import './components/List/list.scss';
import { ICard } from '../../common/interfaces/ICard';
import List from './components/List/List';

const state = {
  title: 'Моя тестовая доска',
  lists: [
    {
      id: 1,
      title: 'Планы',
      cards: [
        { id: 1, title: 'помыть кота' },
        { id: 2, title: 'приготовить суп' },
        { id: 3, title: 'сходить в магазин' },
      ],
    },
    {
      id: 2,
      title: 'В процессе',
      cards: [{ id: 4, title: 'посмотреть сериал' }],
    },
    {
      id: 3,
      title: 'Сделано',
      cards: [
        { id: 5, title: 'сделать домашку' },
        { id: 6, title: 'погулять с собакой' },
      ],
    },
    {
      id: 4,
      title: 'Список 4',
      cards: [
        { id: 1, title: 'check' },
        { id: 2, title: 'check' },
        { id: 3, title: 'check' },
      ],
    },
    {
      id: 5,
      title: 'Список 5',
      cards: [
        { id: 1, title: 'check' },
        { id: 2, title: 'check' },
        { id: 3, title: 'check' },
      ],
    },
    {
      id: 6,
      title: 'Список 6',
      cards: [
        { id: 1, title: 'check' },
        { id: 2, title: 'check' },
        { id: 3, title: 'check' },
      ],
    },
    {
      id: 7,
      title: 'Список 7',
      cards: [
        { id: 1, title: 'check' },
        { id: 2, title: 'check' },
        { id: 3, title: 'check' },
      ],
    },
    {
      id: 8,
      title: 'Список 8',
      cards: [
        { id: 1, title: 'check' },
        { id: 2, title: 'check' },
        { id: 3, title: 'check' },
        { id: 4, title: 'check' },
        { id: 5, title: 'check' },
        { id: 6, title: 'check' },
        { id: 7, title: 'check' },
        { id: 8, title: 'check' },
        { id: 9, title: 'check' },
        { id: 10, title: 'check' },
        { id: 11, title: 'check' },
        { id: 12, title: 'check' },
        { id: 13, title: 'check' },
        { id: 14, title: 'check' },
        { id: 15, title: 'check' },
        { id: 16, title: 'check' },
        { id: 17, title: 'check' },
        { id: 18, title: 'check' },
      ],
    },
  ],
};

export default class Board extends React.Component {
  render() {
    return (
      <div>
        <h1>{state.title}</h1>
        <div className="list-style">
          {state.lists.map((key) => {
            return <List title={key.title} cards={key.cards} />;
          })}
          <button className="create-button">
            + <br /> Create new <br /> list
          </button>
        </div>
      </div>
    );
  }
}
