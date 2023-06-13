import React, { JSX, useEffect, useRef, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../Card/Card';
import { renameList, deleteListFetch, addNewCard } from '../../../../store/modules/board/actions';
import { inputValidation } from '../../../../common/functions/inputValidation';
import useOutsideAlerter from '../../../../common/Hooks/useOutsideAlerter';
import { BoardProps, SlotsProps } from '../../../../common/types/types';
import { setCurrentList } from '../../../../store/modules/slotData/actions';
import { dropHandler } from '../../../../common/functions/dragAndDropFunctions';
import { useSweetAlert } from '../../../../common/functions/sweetAlertHandler';

export default function List({
  board_id,
  list_id,
  title,
}: {
  board_id: string;
  list_id: number;
  title: string;
}): JSX.Element {
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
  const [CardList, setCardList] = useState<JSX.Element[]>([]);
  useEffect(() => {
    board.lists.forEach((list) => {
      if (list.id === list_id) {
        setCardList(
          list.cards.map((card) => (
            <Card
              position={card.position}
              board_id={board_id}
              list_id={list_id}
              key={card.id}
              id={card.id}
              title={card.title}
            />
          ))
        );
      }
    });
  }, [board.lists]);
  const referenceForCartInput = useRef<HTMLTextAreaElement>(null);
  const { ref, isShow, setIsShow } = useOutsideAlerter(false);
  const [showInputListName, setShowInputListName] = useState(false);
  const [listName, setListName] = useState(title);
  const [isWarning, setWarning] = useState(false);
  const [listMenu, setListMenu] = useState(false);
  const [cardInputValue, setCardInputValue] = useState('');
  const [isSlotVisible, setSlotVisibility] = useState<boolean>(false);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const validationHandler = (value: string): void => {
    if (!inputValidation(value)) {
      if (value !== listName) {
        setListName(value);
        renameList(dispatch, board_id, list_id, value).catch(() => {
          dispatch({ type: 'ERROR_ACTION_TYPE' });
        });
      }
      setShowInputListName(false);
      return;
    }
    setWarning(true);
    setTimeout(() => setWarning(false), 1500);
  };
  const onBlurFunction = (e: React.FormEvent, value: string): void => {
    validationHandler(value);
    if (inputValidation(value)) setShowInputListName(false);
  };
  const onKeyDownFunction = (e: React.KeyboardEvent, value: string): void => {
    if (e.key === 'Enter') {
      validationHandler(value);
    }
  };
  const deleteList = (): void => {
    if (listContainerRef.current !== null) listContainerRef.current.style.display = 'none';
    deleteListFetch(dispatch, board_id, list_id).catch(() => {
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    });
    setListMenu(false);
  };
  const submitFunction = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!inputValidation(cardInputValue)) {
      addNewCard(dispatch, CardList.length, board_id, cardInputValue, list_id, true).catch(() => {
        dispatch({ type: 'ERROR_ACTION_TYPE' });
      });
      setCardInputValue('');
      setIsShow(false);
      return;
    }
    setWarning(true);
    setTimeout(() => setWarning(false), 1500);
    setCardInputValue('');
  };
  const enterPressedCard = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!inputValidation(cardInputValue)) {
        addNewCard(dispatch, CardList.length, board_id, cardInputValue, list_id, true).catch(() => {
          dispatch({ type: 'ERROR_ACTION_TYPE' });
        });
        setIsShow(false);
        setCardInputValue('');
        return;
      }
      setWarning(true);
      setTimeout(() => setWarning(false), 1500);
      setCardInputValue('');
      return;
    }
    const el = referenceForCartInput.current;
    setTimeout(() => {
      if (el !== null) {
        el.style.cssText = 'height:auto; padding:0';
        el.style.cssText = `height:${el.scrollHeight}px`;
      }
    }, 1);
  };
  const overEmptyList = (): void => {
    setSlotVisibility(true);
    if (slotRef.current) slotRef.current.style.height = `${slotsData.slotHeight}px`;
  };
  useEffect(() => {
    if (CardList.length === 0 && slotsData.isCardDragged) {
      listContainerRef.current?.addEventListener('dragover', overEmptyList);
    }
    if (!slotsData.isCardDragged) {
      listContainerRef.current?.removeEventListener('dragover', overEmptyList);
      setSlotVisibility(false);
    }
  }, [slotsData.isCardDragged]);
  if (isWarning) {
    useSweetAlert('Prohibited symbols');
    setWarning(false);
  }
  return (
    <div
      onDragEnter={(): void => {
        dispatch(setCurrentList(list_id));
      }}
      ref={listContainerRef}
      id={`list_container_${list_id}`}
      className="list-container"
    >
      {showInputListName ? (
        <input
          maxLength={15}
          className="list-name-input"
          autoFocus
          onKeyDown={(e): void => onKeyDownFunction(e, e.currentTarget.value)}
          onBlur={(e): void => onBlurFunction(e, e.target.value)}
          defaultValue={listName}
        />
      ) : (
        <h2 className="list-container-header" onClick={(): void => setShowInputListName(true)}>
          {listName}
        </h2>
      )}
      <div className="cards" id={list_id.toString()}>
        {CardList}
        {CardList.length === 0 && isSlotVisible && slotsData.currentList === list_id && (
          <div
            draggable
            onDragOver={(e): void => {
              e.preventDefault();
            }}
            onDrop={(e): void =>
              dropHandler(
                e,
                list_id,
                slotsData.currentCard,
                board,
                board_id,
                dispatch,
                slotsData.draggedCardList,
                slotsData.draggedCardPos,
                slotsData.draggedCardTitle,
                0
              )
            }
            ref={slotRef}
            className="slot-style"
          />
        )}
      </div>
      <BsThreeDots onClick={(): void => setListMenu(!listMenu)} className="menu-dots" />
      {listMenu && (
        <div className="list-menu">
          <button onClick={(): void => deleteList()} className="delete-list-button">
            Delete list
          </button>
        </div>
      )}
      {!isShow && (
        <button onClick={(): void => setIsShow(!isShow)} className="add-card-button">
          + Add card
        </button>
      )}
      {isShow && (
        <form ref={ref} className="from-for-card">
          <textarea
            ref={referenceForCartInput}
            id="resizable"
            autoFocus
            onChange={(e): void => {
              setCardInputValue(e.currentTarget.value);
            }}
            placeholder="Enter a card..."
            className="input-for-card"
            onKeyDown={(e): void => {
              enterPressedCard(e);
            }}
          />
          <button onClick={(e): void => submitFunction(e)} className="submit-button-card">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
