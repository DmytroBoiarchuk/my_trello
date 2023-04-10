import React, { useEffect, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { deleteCard, getBoard, getBoardTitle, renameCard } from '../../../../store/modules/board/actions';
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
} from '../../../../store/modules/slotData/actions';
import { cardModalState, slotsProps } from '../../../../common/types/types';
import { BoardProps } from '../../../../common/interfaces/IBoard';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { putCardData, setModalCardEditBig } from '../../../../store/modules/cardModal/actions';
import CardEditModalBig from '../ModalCreating/CardEditModalBig';
//
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
  useEffect(() => {
    if (card_id) {
      putCardData({ id: +card_id });
      setModalCardEditBig(true);
    } else {
      setModalCardEditBig(false);
    }
  }, []);
  const { ref, isShow, setIsShow } = useOutsideAlerter(false);
  const [editCardValue, setEditCardValue] = useState(props.title);
  const [CardValue, setCardValue] = useState(editCardValue);
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

  const openEditCardWindow = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
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
    deleteCard(dispatch, props.board_id, props.id, board.lists, props.list_id);
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
  const dragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
    putTitle(CardValue);
    putHeight(e.currentTarget.scrollHeight);
    setCurrentCard(+e.currentTarget.id);
    setDraggedCardList(props.list_id);
    setDraggedCardPos(props.position);
    dragStarted(e, props.id);
  };
  const dragEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
    dragEnd(e, e.currentTarget.id);
  };
  const dragEnterHandler = (e: React.DragEvent<HTMLDivElement>) => {
    dragEnter(e, slotsData, props.position, props.list_id);
  };
  const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
    dragOver(e, slotsData, props.list_id, e.currentTarget.id, props.position, board, props.board_id, dispatch);
  };
  const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
    setPrevId(+e.currentTarget.id);
  };
  const onDragHandler = () => {
    let slots: NodeList = document.querySelectorAll('.slot-style');
    if (slots.length > 1) {
      slots[0].parentNode?.removeChild(slots[0]);
    }
  };
  const dropHandler = (e: React.DragEvent<HTMLDivElement>) => {
    drop(e, slotsData, props.list_id, props.position, board, props.board_id, dispatch);
  };
  const onclickHandler = () => {
    putCardData({ id: props.id });
    setModalCardEditBig(true);
    navigate(`/board/${props.board_id}/card/${props.id}`);
  };
  const { cardModalData } = useSelector(
    (state: cardModalState): cardModalState => ({
      cardModalData: state.cardModalData,
    })
  );

  return (
    <>
      {cardModalData.isOpen && cardModalData.card.id === props.id && (
        <CardEditModalBig
          key={props.id}
          position={props.position}
          list_id={props.list_id}
          list_title={props.list_title}
          title={CardValue}
          setTitle={setCardValue}
          description={props.description}
        />
      )}
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
          {CardValue}
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
            defaultValue={CardValue}
            autoFocus
            className="card-edit-input"
            onChange={(e) => setEditCardValue(e.currentTarget.value)}
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
