import { ICard } from '../../../../common/interfaces/ICard';
import React, { useState } from 'react';
import Card from '../Card/Card';

export default function List(props: { title: string; cards: ICard[] }) {
  const [showInputListName, setShowInputListName] = useState(false);
  const [listName, setListName] = useState(props.title);

  const onBlurFunction = (value: string) => {
    setListName(value);
    setShowInputListName(false);
  };
  return (
    <div className="list-container">
      {showInputListName ? (
        <input
          maxLength={15}
          className="list-name-input"
          autoFocus
          onBlur={(e) => onBlurFunction(e.target.value)}
          defaultValue={listName}
        ></input>
      ) : (
        <h2 onClick={() => setShowInputListName(true)}>{listName}</h2>
      )}
      <div className="cards">
        {props.cards.map((key) => {
          return <Card title={key.title} />;
        })}
      </div>
    </div>
  );
}
