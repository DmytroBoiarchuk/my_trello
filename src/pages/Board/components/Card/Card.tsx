import React, { JSX, useEffect, useRef, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { deleteCard, renameCard } from '../../../../store/modules/board/actions';
import './card.scss';
import { inputValidation } from '../../../../common/functions/inputValidation';
import useOutsideAlerter from '../../../../common/Hooks/useOutsideAlerter';
import { dragEnd, dragOver, dragStarted, dropHandler } from '../../../../common/functions/dragAndDropFunctions';
import { isCardDragged, putSlotData, setSlotPos } from '../../../../store/modules/slotData/actions';
import { BoardProps, SlotsProps } from '../../../../common/types/types';
import { putCardData, setModalCardEditBig } from '../../../../store/modules/cardModal/actions';

function Card({
  position,
  board_id,
  list_id,
  id,
  title,
}: {
  position: number;
  board_id: string;
  list_id: number;
  id: number;
  title: string;
}): JSX.Element {
  const cardRef = useRef<HTMLParagraphElement>(null);
  const cardBoxRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const firstSlotRef = useRef<HTMLDivElement>(null);
  const { ref, isShow, setIsShow } = useOutsideAlerter(false);
  const [editCardValue, setEditCardValue] = useState(title);
  const [bottomSlotShown, setBottomSlotShown] = useState(true);
  const [firstSlotShown, setFirstSlotShown] = useState(false);
  const [isWarning, setWarning] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cardId } = useParams();
  const { slotsData } = useSelector(
    (state: SlotsProps): SlotsProps => ({
      slotsData: state.slotsData,
    })
  );
  const { board } = useSelector(
    (state: BoardProps): BoardProps => ({
      board: state.board,
    })
  );
  const isOriginSlot = (): boolean =>
    slotsData.isCardDragged &&
    slotsData.currentCard === id &&
    slotsData.slotPos === -2 &&
    slotsData.currentList === list_id;
  useEffect(() => {
    if (cardId) {
      dispatch(putCardData({ id: +cardId }));
      dispatch(setModalCardEditBig(true));
      return;
    }
    dispatch(setModalCardEditBig(false));
  }, []);
  useEffect(() => {
    dispatch(setSlotPos(-2));
    if (slotsData.currentList !== list_id) {
      setFirstSlotShown(false);
    }
  }, [slotsData.currentList]);
  const openEditCardWindow = (e: React.MouseEvent<SVGElement>): void => {
    e.stopPropagation();
    setIsShow(true);
  };
  const editCardButtonSaveClicked = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!inputValidation(editCardValue)) {
      setTimeout(() => renameCard(dispatch, board_id, list_id, id, editCardValue), 100);
      setIsShow(false);
      return;
    }
    setWarning(true);
    setTimeout(() => setWarning(false), 1500);
    setEditCardValue(title);
  };
  const editCardButtonDeleteClicked = (e: React.FormEvent): void => {
    e.preventDefault();
    deleteCard(dispatch, board_id, id, board.lists, list_id).catch(() => {
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    });
    setIsShow(false);
  };
  const onCardDropHandler = (e: React.DragEvent<HTMLParagraphElement>): void => {
    const midlOfCard = e.currentTarget.scrollHeight / 2 + e.currentTarget.getBoundingClientRect().y;
    dropHandler(
      e,
      slotsData.currentList,
      slotsData.currentCard,
      board,
      board_id,
      dispatch,
      slotsData.draggedCardList,
      slotsData.draggedCardPos,
      slotsData.draggedCardTitle,
      e.clientY < midlOfCard ? position : position + 1
    );
  };
  const dragStartHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    dispatch(putSlotData(e.currentTarget.scrollHeight, +e.currentTarget.id, list_id, position, title));
    dispatch(isCardDragged(true));
    dragStarted(e, id, cardRef);
  };
  const dragEndHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    dragEnd(e, e.currentTarget.id, cardRef);
    dispatch(isCardDragged(false));
  };
  const dragOverHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    dragOver(e, position, setFirstSlotShown, setBottomSlotShown, dispatch);
  };
  const onclickHandler = (): void => {
    dispatch(putCardData({ id }));
    dispatch(setModalCardEditBig(true));
    navigate(`/board/${board_id}/card/${id}`);
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
    <div className="card-box" id={`card_box_${id}`} ref={cardBoxRef}>
      {!isShow ? (
        <>
          {slotsData.isCardDragged && firstSlotShown && list_id === slotsData.currentList && (
            <div
              onDragOver={(e): void => {
                e.preventDefault();
              }}
              onDrop={(e): void => {
                setFirstSlotShown(false);
                dropHandler(
                  e,
                  slotsData.currentList,
                  slotsData.currentCard,
                  board,
                  board_id,
                  dispatch,
                  slotsData.draggedCardList,
                  slotsData.draggedCardPos,
                  slotsData.draggedCardTitle,
                  0
                );
              }}
              style={{ height: `${slotsData.slotHeight}px` }}
              className="slot-style"
              ref={firstSlotRef}
            />
          )}
          <p
            ref={cardRef}
            id={id.toString()}
            onDragEnd={(e): void => dragEndHandler(e)}
            onDragStart={(e): void => dragStartHandler(e)}
            onDrop={(e): void => {
              setFirstSlotShown(false);
              onCardDropHandler(e);
            }}
            draggable
            onDragOver={(e): void => dragOverHandler(e)}
            className="card-style"
            onClick={(): NodeJS.Timeout => setTimeout(() => onclickHandler())}
          >
            {title}
            <FaPencilAlt
              onClick={(e): void => {
                openEditCardWindow(e);
              }}
              className="edit-card"
            />
          </p>
          {(isOriginSlot() ||
            (position === slotsData.slotPos &&
              list_id === slotsData.currentList &&
              !firstSlotShown &&
              bottomSlotShown)) && (
            <div
              onDragOver={(e): void => {
                e.preventDefault();
              }}
              onDrop={(e): void => {
                if (!isOriginSlot())
                  dropHandler(
                    e,
                    slotsData.currentList,
                    slotsData.currentCard,
                    board,
                    board_id,
                    dispatch,
                    slotsData.draggedCardList,
                    slotsData.draggedCardPos,
                    slotsData.draggedCardTitle,
                    position + 1
                  );
              }}
              style={{ height: `${slotsData.slotHeight}px` }}
              className="slot-style"
              ref={slotRef}
            />
          )}
        </>
      ) : (
        <form ref={ref} className="card-edit-form">
          <input
            defaultValue={title}
            onChange={(e): void => {
              setEditCardValue(e.target.value);
            }}
            autoFocus
            className="card-edit-input"
          />
          <div className="card-edit-button-container">
            <button onClick={(e): void => editCardButtonSaveClicked(e)} className="card-edit-button">
              Save
            </button>
            <button onClick={(e): void => editCardButtonDeleteClicked(e)} className="red-on-button">
              Delete
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Card;
