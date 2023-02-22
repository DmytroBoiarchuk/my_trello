import React, { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { deleteCard, renameCard } from '../../../../store/modules/board/actions';
import './card.scss';
import { useDispatch, useSelector } from 'react-redux';
import { validate } from '../../../../common/functions/validate';
import useOutsideAlerter from '../../../../common/Hooks/useOutsideAlerter';
import Swal from 'sweetalert2';
import { dragEnd, dragStarted, dragEnter, dragOver, dragLeave } from '../../../../common/functions/dnd';
import {
  deletePrevId,
  putHeight,
  setCurrentCard,
  setPrevId,
  setLastSlot,
} from '../../../../store/modules/slotHeihgt/actions';
import { slotsProps } from '../../../../common/types/types';

const Card = (props: { position: number; board_id: string; list_id: number; id: number; title: string }) => {
  const { ref, isShow, setIsShow } = useOutsideAlerter(false);
  const [editCardValue, setEditCardValue] = useState(props.title);
  const [CardValue, setCardValue] = useState(editCardValue);
  const [isWarning, setWarning] = useState(false);
  const dispatch = useDispatch();
  const { slotsData } = useSelector(
    (state: slotsProps): slotsProps => ({
      slotsData: state.slotsData,
    })
  );
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
  if (isWarning) {
    Swal.fire({
      icon: 'error',
      iconColor: '#da4c4c',
      showConfirmButton: false,
      showCloseButton: true,
      text: 'Error: Prohibited symbols!',
    });
    setWarning(false);
  }
  const dragStartHandler = (e: React.DragEvent) => {
    putHeight(e.currentTarget.scrollHeight);
    dragStarted(e, props.id, CardValue, e.clientX, e.clientY);
  };
  const dragEndHandler = (e: React.DragEvent) => {
    dragEnd(e, e.currentTarget.id, slotsData);
  };
  const dragEnterHandler = (e: React.DragEvent) => {
    dragEnter(e, slotsData, props.position);
  };
  const dragOverHandler = (e: React.DragEvent) => {
    dragOver(e, slotsData, props.list_id, e.currentTarget.id);
  };
  const dragLeaveHandler = (e: React.DragEvent) => {
    setPrevId(+e.currentTarget.id);
    dragLeave(e, slotsData);
  };
  return (
    <>
      {!isShow ? (
        <p
          id={props.id.toString()}
          onDragEnd={(e) => dragEndHandler(e)}
          onDragStart={(e) => dragStartHandler(e)}
          draggable
          onDragOver={(e) => dragOverHandler(e)}
          onDragLeave={(e) => dragLeaveHandler(e)}
          onDragEnter={(e) => dragEnterHandler(e)}
          className="card-style"
        >
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
