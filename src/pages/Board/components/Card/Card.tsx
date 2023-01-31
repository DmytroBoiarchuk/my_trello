import React, { useEffect, useRef, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { deleteCard, renameCard } from '../../../../store/modules/board/actions';
import './card.scss';
import { useDispatch } from 'react-redux';
import { validate } from '../../../../common/functions/validate';
import ErrorWarning from '../ErrorWarning/ErrorWarning';
import useOutsideAlerter from '../../../../common/Hooks/useOutsideAlerter';

const Card = (props: { position: number; board_id: string; list_id: number; id: number; title: string }) => {
  const { ref, isShow, setIsShow } = useOutsideAlerter(false);
  const [editCardValue, setEditCardValue] = useState(props.title);
  const [CardValue, setCardValue] = useState(editCardValue);
  const [isWarning, setWarning] = useState(false);
  const dispatch = useDispatch();
  const openEditCardWindow = () => {
    setIsShow(true);
  };
  const editCardButtonSaveClicked = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(editCardValue)) {
      setCardValue(editCardValue);
      setTimeout(() => renameCard(dispatch, props.board_id, props.list_id, props.id, editCardValue), 100);
      setIsShow(false);
    } else {
      setWarning(true);
      setTimeout(() => setWarning(false), 1500);
      setEditCardValue(props.title);
    }
  };
  const editCardButtonDeleteClicked = (e: React.FormEvent) => {
    e.preventDefault();
    deleteCard(dispatch, props.board_id, props.id);
    setIsShow(false);
  };
  return (
    <>
      {isWarning && <ErrorWarning />}
      {!isShow ? (
        <p className="card-style">
          {CardValue}
          <FaPencilAlt
            onClick={() => {
              openEditCardWindow();
            }}
            className="edit-card"
          />
        </p>
      ) : (
        <form ref={ref} className="card-edit-form">
          <input
            defaultValue={CardValue}
            autoFocus
            className="card-edit-input"
            onChange={(e) => setEditCardValue(e.currentTarget.value)}
          />
          <div className="card-edit-button-container">
            <button onClick={(e) => editCardButtonSaveClicked(e)} className="card-edit-button">
              Save
            </button>
            <button onClick={(e) => editCardButtonDeleteClicked(e)} className="card-edit-button">
              Delete
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default Card;
