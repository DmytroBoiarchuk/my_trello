import React, { useEffect, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { deleteCard, renameCard } from '../../../../store/modules/board/actions';
import './card.scss';
import { useDispatch, useSelector } from 'react-redux';
import { validate } from '../../../../common/functions/validate';
import useOutsideAlerter from '../../../../common/Hooks/useOutsideAlerter';
import Swal from 'sweetalert2';
import { dragEnd, dragStarted, dragEnter, dragOver, drop } from '../../../../common/functions/dnd';
import {
  putTitle,
  putHeight,
  setCurrentCard,
  setDraggedCardList,
  setDraggedCardPos,
  setPrevId,
  isCardDragged,
} from '../../../../store/modules/slotData/actions';
import { slotsProps } from '../../../../common/types/types';
import { BoardProps } from '../../../../common/interfaces/IBoard';
import { useNavigate, useParams } from 'react-router-dom';
import { putCardData, setModalCardEditBig } from '../../../../store/modules/cardModal/actions';

const Card = (props: {
  list_title: string;
  position: number;
  board_id: string;
  list_id: number;
  id: number;
  title: string;
  description: string | undefined;
}) => {
  let { card_id } = useParams();
  const { ref, isShow, setIsShow } = useOutsideAlerter(false);
  const [editCardValue, setEditCardValue] = useState(props.title);
  const [isWarning, setWarning] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slotsData } = useSelector(
    (state: slotsProps): slotsProps => ({
      slotsData: state.slotsData,
    })
  );
  const { board } = useSelector(
    (state: BoardProps): BoardProps => ({
      board: state.board,
    })
  );
  useEffect(() => {
    if (card_id) {
      putCardData({ id: +card_id });
      setModalCardEditBig(true);
    } else {
      setModalCardEditBig(false);
    }
  }, []);
  const openEditCardWindow = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    setIsShow(true);
  };
  const editCardButtonSaveClicked = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(editCardValue)) {
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
    deleteCard(dispatch, props.board_id, props.id, board.lists, props.list_id);
    setIsShow(false);
  };

  const dragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
    isCardDragged(true);
    putTitle(props.title);
    putHeight(e.currentTarget.scrollHeight);
    setCurrentCard(+e.currentTarget.id);
    setDraggedCardList(props.list_id);
    setDraggedCardPos(props.position);
    dragStarted(e, props.id);
  };
  const dragEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
    dragEnd(e, e.currentTarget.id);
    isCardDragged(false);
  };
  const dragEnterHandler = (e: React.DragEvent<HTMLDivElement>) => {
    if (slotsData.isItCard) dragEnter(e, slotsData, props.position, props.list_id);
  };
  const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
    if (slotsData.isItCard)
      dragOver(e, slotsData, props.list_id, e.currentTarget.id, props.position, board, props.board_id, dispatch);
  };
  const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
    if (slotsData.isItCard) setPrevId(+e.currentTarget.id);
  };
  const onDragHandler = () => {
    let slots: NodeList = document.querySelectorAll('.slot-style');
    if (slots.length > 1) {
      slots[0].parentNode?.removeChild(slots[0]);
    }
  };
  const dropHandler = (e: React.DragEvent<HTMLDivElement>) => {
    drop(e, slotsData, props.list_id, props.position, board, props.board_id, dispatch);
    isCardDragged(false);
  };
  const onclickHandler = () => {
    putCardData({ id: props.id });
    setModalCardEditBig(true);
    navigate(`/board/${props.board_id}/card/${props.id}`);
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
  return (
    <>
      {!isShow ? (
        <p
          id={props.id.toString()}
          onDragEnd={(e) => dragEndHandler(e)}
          onDragStart={(e) => dragStartHandler(e)}
          draggable
          onDrag={() => onDragHandler()}
          onDragOver={(e) => dragOverHandler(e)}
          onDragLeave={(e) => dragLeaveHandler(e)}
          onDragEnter={(e) => dragEnterHandler(e)}
          onDrop={(e) => dropHandler(e)}
          className="card-style"
          onClick={() => setTimeout(() => onclickHandler())}
        >
          {props.title}
          <FaPencilAlt
            onClick={(e) => {
              openEditCardWindow(e);
            }}
            className="edit-card"
          />
        </p>
      ) : (
        <form ref={ref} className="card-edit-form">
          <input
            defaultValue={props.title}
            onChange={(e) => {
              setEditCardValue(e.target.value);
            }}
            autoFocus
            className="card-edit-input"
          />
          <div className="card-edit-button-container">
            <button onClick={(e) => editCardButtonSaveClicked(e)} className="card-edit-button">
              Save
            </button>
            <button onClick={(e) => editCardButtonDeleteClicked(e)} className="red-onbutton">
              Delete
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default Card;
