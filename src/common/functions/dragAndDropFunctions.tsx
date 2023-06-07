import React from 'react';
import { Dispatch } from 'redux';
import { isCardDragged, setSlotPos } from '../../store/modules/slotData/actions';
import { IList } from '../interfaces/IList';
import { replaceCard } from '../../store/modules/board/actions';
import { ICard } from '../interfaces/ICard';
import store from '../../store/store';

export const dragStarted = (
  e: React.DragEvent<HTMLDivElement>,
  id: number,
  cardRef: React.RefObject<HTMLDivElement>
): void => {
  const card = cardRef.current;
  setTimeout(() => {
    if (card) card.style.display = 'none';
  }, 1);
};

export const dragEnd = (
  e: React.DragEvent<HTMLDivElement>,
  id: string,
  cardRef: React.RefObject<HTMLDivElement>
): void => {
  store.dispatch(setSlotPos(-2));
  const card = cardRef.current;
  if (card) card.style.display = 'block';
};
const ifMovingToAnotherList = (
  list: IList,
  currentCard: number,
  draggedCardTitle: string,
  neededPos: number
): ICard[] => {
  const updatedList: ICard[] = [];
  if (list.cards.length === 0) {
    updatedList.push({ id: currentCard, position: 0, title: draggedCardTitle });
  }
  for (let i = 0; i < list.cards.length; i++) {
    if (list.cards[i].position === neededPos) {
      updatedList.push({ id: currentCard, position: neededPos, title: draggedCardTitle });
    }
    updatedList.push(list.cards[i]);
    if (i + 1 === list.cards.length && neededPos === i + 1) {
      updatedList.push({ id: currentCard, position: neededPos, title: draggedCardTitle });
    }
  }
  return updatedList;
};
const ifTargetList = (
  list: IList,
  neededPos: number,
  draggedCardPos: number,
  currentCard: number,
  draggedCardTitle: string
): ICard[] => {
  const updatedList: ICard[] = [];
  for (let i = 0; i < list.cards.length; i++) {
    if (i !== neededPos && i !== draggedCardPos) {
      updatedList.push(list.cards[i]);
    } else if (i === neededPos) {
      if (neededPos !== draggedCardPos) {
        updatedList.push({ id: currentCard, position: neededPos, title: draggedCardTitle });
      }
      updatedList.push(list.cards[i]);
    }
  }
  if (neededPos === list.cards.length) {
    updatedList.push({ id: currentCard, position: neededPos, title: draggedCardTitle });
  }
  return updatedList;
};
export const dropHandler = (
  e: React.DragEvent<HTMLDivElement>,
  list_id: number,
  currentCard: number,
  board: { title: string; lists: IList[] },
  board_id: string,
  dispatch: Dispatch,
  draggedCardList: number,
  draggedCardPos: number,
  draggedCardTitle: string,
  neededPos: number
): void => {
  const currentList = board.lists.find((list) => list.id === list_id);
  const startList = board.lists.find((list) => list.id === draggedCardList);
  const lists: { id: number; cards: ICard[] }[] = [];
  board.lists.forEach((list) => {
    if (list_id !== draggedCardList) {
      if (list.id === list_id) {
        const updatedList: ICard[] = ifMovingToAnotherList(list, currentCard, draggedCardTitle, neededPos);
        lists.push({ id: list_id, cards: updatedList });
      } else if (list.id === draggedCardList) {
        const updatedList: ICard[] = [];
        for (let i = 0; i < list.cards.length; i++) {
          if (i !== draggedCardPos) {
            updatedList.push(list.cards[i]);
          }
        }
        lists.push({ id: draggedCardList, cards: updatedList });
      } else {
        lists.push(list);
      }
    } else if (list.id === list_id) {
      const updatedList: ICard[] = ifTargetList(list, neededPos, draggedCardPos, currentCard, draggedCardTitle);
      lists.push({ id: list_id, cards: updatedList });
    } else {
      lists.push(list);
    }
  });
  dispatch({ type: 'UPDATE_BOARD_DND', payload: lists });
  replaceCard(
    board_id,
    neededPos,
    list_id.toString(),
    currentCard,
    dispatch,
    currentList,
    draggedCardPos,
    draggedCardList,
    startList?.cards
  ).catch(() => {
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  });
  dispatch(isCardDragged(false));
};
export const dragOver = (
  e: React.DragEvent<HTMLDivElement>,
  position: number,
  setFirstSlotShown: React.Dispatch<React.SetStateAction<boolean>>,
  setBottomSlotShown: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: Dispatch
): void => {
  const midlOfCard = e.currentTarget.scrollHeight / 2 + e.currentTarget.getBoundingClientRect().y;
  if (e.clientY < midlOfCard) {
    if (position === 0) {
      setFirstSlotShown(true);
      setBottomSlotShown(false);
    } else {
      dispatch(setSlotPos(position - 1));
    }
  } else {
    dispatch(setSlotPos(position));
    setFirstSlotShown(false);
    setBottomSlotShown(true);
  }
};
