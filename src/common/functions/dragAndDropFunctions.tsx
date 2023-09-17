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
  if (list.cards.length === 0) {
    return [{ id: currentCard, position: 0, title: draggedCardTitle }];
  }
  const updatedList: ICard[] = [];
  list.cards.forEach((card) => {
    if (card.position === neededPos) {
      updatedList.push({ id: currentCard, position: neededPos, title: draggedCardTitle });
    }
    updatedList.push(card);
  });
  if (list.cards.length === neededPos) {
    updatedList.push({ id: currentCard, position: neededPos, title: draggedCardTitle });
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
  list.cards.forEach((card) => {
    if (card.position !== draggedCardPos && card.position !== neededPos) {
      updatedList.push(card);
    } else if (card.position === neededPos) {
      updatedList.push({ id: currentCard, position: neededPos, title: draggedCardTitle });
      updatedList.push(card);
    }
  });
  if (neededPos === list.cards.length) {
    updatedList.push({ id: currentCard, position: neededPos, title: draggedCardTitle });
  }
  return updatedList;
};
const getListPairForDrop = (
  board: { title: string; lists: IList[] },
  list_id: number,
  draggedCardList: number
): (IList | undefined)[] => {
  const currentList = board.lists.find((list) => list.id === list_id);
  const startList = board.lists.find((list) => list.id === draggedCardList);
  return [currentList, startList];
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
  const [currentList, startList] = getListPairForDrop(board, list_id, draggedCardList);
  const lists = board.lists.map((list) => {
    if (list.id === list_id) {
      return {
        ...list,
        cards:
          list_id !== draggedCardList
            ? ifMovingToAnotherList(list, currentCard, draggedCardTitle, neededPos)
            : ifTargetList(list, neededPos, draggedCardPos, currentCard, draggedCardTitle),
      };
    }
    if (list.id === draggedCardList) {
      return { ...list, cards: list.cards.filter((card) => card.position !== draggedCardPos) };
    }
    return list;
  });
  dispatch({ type: 'UPDATE_BOARD_DRAG`N`DROP', payload: lists });
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
