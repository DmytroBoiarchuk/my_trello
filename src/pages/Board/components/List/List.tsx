import { ICard } from '../../../../common/interfaces/ICard';
import React from 'react';
import Card from '../Card/Card';

export default function List(props: { title: string; cards: ICard[] }) {
  return (
    <h2>
      {props.title}
      <div className="cards">
        {props.cards.map((key) => {
          return <Card title={key.title} />;
        })}
      </div>
    </h2>
  );
}
